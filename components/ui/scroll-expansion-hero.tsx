"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import ScrollHint from "@/components/ui/ScrollHint";
import MeshBlob from "@/components/ui/MeshBlob";
import { useMediaBudget } from "@/lib/hooks";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  /** Describes the expanding photo/video for assistive tech; omit if purely atmospheric. */
  mediaAlt?: string;
  /**
   * For `mediaType: "video"`: the base layer, visible immediately and — for
   * Save-Data/2G/reduced-motion visitors, who never mount a <video> at all —
   * permanently. Effectively required for any real video usage even though
   * it's typed optional (an image-only caller has no use for it).
   */
  posterSrc?: string;
  /**
   * Ties the video's playhead to the expansion progress instead of letting it
   * play on its own, so scrolling scrubs the footage. Ignored for images and
   * under reduced motion (progress is pinned at 1, so there is no gesture to
   * scrub with and the video just plays). Requires a densely-keyframed encode
   * to be smooth: with a single keyframe the browser re-decodes from frame 1
   * on every seek.
   */
  scrubOnScroll?: boolean;
  bgImageSrc: string;
  /** Small label shown under the media as it starts small (e.g. "About ACTS"). */
  eyebrow?: string;
  /** Split across two lines and animated apart as the media expands. */
  title?: string;
  scrollHint?: string;
  /** Overlays the title on the media via mix-blend-difference instead of solid white. */
  textBlend?: boolean;
  children?: ReactNode;
}

// Splits a title into two lines at the word boundary nearest its midpoint by
// character count, so neither animated half ends up far wider than the other
// (a naive "first word vs. the rest" split leaves long titles' second half
// overflowing the viewport once fully slid apart).
function splitTitleBalanced(title?: string): [string, string] {
  if (!title) return ["", ""];
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return [title, ""];

  let splitIndex = 1;
  let bestDiff = Infinity;
  let charsSoFar = 0;
  for (let i = 0; i < words.length - 1; i++) {
    charsSoFar += words[i].length + 1;
    const diff = Math.abs(charsSoFar - title.length / 2);
    if (diff < bestDiff) {
      bestDiff = diff;
      splitIndex = i + 1;
    }
  }
  return [words.slice(0, splitIndex).join(" "), words.slice(splitIndex).join(" ")];
}

/**
 * ScrollExpandMedia — a full-viewport intro where a small "postcard" of media
 * grows to fill the screen as the visitor scrolls, before handing off into the
 * rest of the page.
 *
 * It does NOT take scroll away from the browser. The section reserves a real
 * scroll runway (one extra viewport of height) and pins the stage inside it
 * with `position: sticky`; expansion progress is read back out of the page's
 * own scroll offset. That distinction is the whole point:
 *
 *   - the native scrollbar can be dragged, and its track clicked, because the
 *     page really is scrolling
 *   - Space / PageDown / arrows / Home / End work, because they are ordinary
 *     scrolling and nothing reverts them
 *   - the reading-progress bar in the header advances, because `scrollY`
 *     advances
 *   - same-page anchors (the quick-nav dock) just work, with no interception
 *   - wheel handling is the browser's, so it is per-device correct — no
 *     guessing at `deltaMode` — and stays on the compositor
 *
 * The earlier version instead swallowed `wheel`/`touchmove` and snapped
 * `scrollY` back to 0 on every scroll event until the media had expanded,
 * which left every one of those broken.
 *
 * Expansion is published as a single CSS custom property (`--p`, 0 to 1) on
 * the section and consumed by `calc()` in the styles below, so scrolling
 * re-renders nothing in React.
 *
 * Under `prefers-reduced-motion` the runway collapses to nothing, which puts
 * progress at 1 on the first measurement: the hero renders fully expanded and
 * fully revealed, with no pinning at all.
 */
export default function ScrollExpandMedia({
  mediaType = "image",
  mediaSrc,
  mediaAlt = "",
  posterSrc,
  scrubOnScroll = false,
  bgImageSrc,
  eyebrow,
  title,
  scrollHint = "Scroll to explore",
  textBlend,
  children,
}: ScrollExpandMediaProps) {
  const reduced = useReducedMotion();
  // Reduced motion pins progress at 1, so there is no gesture to scrub with —
  // fall back to ordinary playback rather than freezing on the last frame.
  const scrubbing = scrubOnScroll && mediaType === "video" && !reduced;
  // Save-Data/2G visitors get the poster and nothing else — see the
  // mount-gating effect below for why "nothing else" also means the <video>
  // tag itself never exists in the tree for them, not just an unset src.
  const budget = useMediaBudget();

  const sectionRef = useRef<HTMLElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Latest progress, for the video scrubber to read. Kept in a ref rather than
  // state for the same reason `--p` is a CSS variable: scrolling must not
  // re-render.
  const progressRef = useRef(0);
  // Installed by the scrub effect below; called from the scroll loop so both
  // share one frame's worth of work.
  const seekRef = useRef<(() => void) | null>(null);
  // Gates when the <video> element itself is first mounted (see the effect
  // below) — kept separate from `budget` so a still-budget visitor never
  // flips this at all.
  const [videoReady, setVideoReady] = useState(false);
  const showVideo = mediaType === "video" && budget === "full" && videoReady;

  // The poster/establishing shot are this stage's real content and are
  // already `priority`-loaded; a multi-megabyte scrub video does not need to
  // join that same first round of requests. Not rendering the <video> tag at
  // all until the stage is about to be seen means the browser's preload
  // scanner — which reads the raw HTML before any JS runs — never has a
  // `preload="auto"` video source to race against the page's actual LCP
  // candidate in the first place. `rootMargin` matches useOnscreen's
  // "prepare" convention elsewhere on the site.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || mediaType !== "video" || budget !== "full") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [mediaType, budget]);

  useEffect(() => {
    const section = sectionRef.current;
    const runway = runwayRef.current;
    if (!section || !runway) return;

    let raf = 0;
    // The published value, which chases the measured one rather than snapping
    // to it. See the smoothing note below.
    let shown: number | null = null;

    const measure = () => {
      const rect = runway.getBoundingClientRect();
      // The runway is one viewport of pinned stage plus the distance the
      // expansion is spread over, so that distance is exactly what is left
      // once a viewport is taken off its height — and it is also exactly when
      // the sticky stage unpins, so progress reaches 1 on the frame the hero
      // starts scrolling away. Measuring rather than assuming `100vh` keeps
      // `dvh` and `vh` disagreeing (mobile URL bars) from stranding progress
      // short of 1.
      const distance = rect.height - window.innerHeight;
      return distance <= 0 ? 1 : Math.min(Math.max(-rect.top / distance, 0), 1);
    };

    const update = () => {
      raf = 0;
      const target = measure();

      // Everything on this stage is a direct function of `--p`: the media's
      // width and height, the title's slide, the establishing shot's fade and
      // — most visibly — the scrim over the footage, which ramps across most
      // of its opacity range as the hero expands. Publishing the raw
      // measurement therefore turns every discrete scroll step into a step
      // change in brightness, so a mouse wheel (which arrives as widely
      // spaced jumps, not a continuous gesture) made the shot look like it
      // was being lit and unlit as you scrolled, and pushed the scrubbed
      // video through a chunk of footage per notch.
      //
      // Chasing the measurement instead spreads each of those jumps over a
      // handful of frames. It reaches ~90% in about 150ms, which is short
      // enough that the expansion still feels attached to the gesture, and
      // it costs nothing on a continuous gesture (trackpad, dragged
      // scrollbar), where target and shown are never far apart to begin with.
      if (shown === null) {
        shown = target; // first paint must land exactly, with no travel
      } else {
        const next = shown + (target - shown) * 0.22;
        // Snap once the remaining travel is invisible, so the ends settle
        // exactly on 0 and 1 and the loop can stop instead of chasing
        // an asymptote forever.
        shown = Math.abs(target - next) < 0.0005 ? target : next;
      }

      progressRef.current = shown;
      section.style.setProperty("--p", shown.toFixed(4));
      seekRef.current?.();

      // Keep stepping while still converging — scroll events alone would
      // stop arriving mid-chase and strand the stage short of its target.
      if (shown !== target) schedule();
    };

    function schedule() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    update();
    // Passive: this only reads scroll position, so the browser never has to
    // wait on it before scrolling.
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Scroll-scrubbed playback: expansion progress drives the playhead.
  //
  // Seeks are already coalesced to one per frame by the scroll loop above, and
  // are additionally skipped while a previous seek is still in flight: a video
  // cannot decode as fast as a trackpad emits scroll, and queueing seeks the
  // element can never drain makes the picture stop tracking the gesture
  // entirely. `seeked` is what tells us the decoder is free again.
  useEffect(() => {
    const video = videoRef.current;
    // Also re-runs once `showVideo` flips true: before that the <video> tag
    // doesn't exist yet (see the mount-gating effect above), so the first
    // pass through here is always a no-op for anything but a still-budget
    // visitor, who never mounts one at all.
    if (!video) return;
    if (!scrubbing) {
      // `autoPlay` is only consulted when the element is created, and
      // `prefers-reduced-motion` is unknown during SSR — so a reduced-motion
      // visitor gets the element built with autoplay off, then `scrubbing`
      // resolves to false a beat later and the attribute change comes too
      // late to start anything. Kick it off explicitly instead. Rejection is
      // ignored: a browser refusing to autoplay is not an error worth acting
      // on, and the poster stays up.
      void video.play().catch(() => {});
      return;
    }

    video.pause();
    let seeking = false;
    const onSeeked = () => {
      seeking = false;
    };
    const seek = () => {
      const duration = video.duration;
      if (!duration || Number.isNaN(duration) || seeking) return;
      // Stop just short of the end: seeking exactly to duration parks some
      // browsers on a blank frame and fires `ended`.
      const target = Math.max(0, Math.min(duration - 0.05, progressRef.current * duration));
      if (Math.abs(video.currentTime - target) < 0.03) return;
      seeking = true;
      video.currentTime = target;
    };

    video.addEventListener("seeked", onSeeked);
    // Duration is unknown until metadata lands, so the first seek usually
    // no-ops. Re-run it then, which also covers a reload partway down the
    // runway: the frame has to match wherever the page is already scrolled to.
    video.addEventListener("loadedmetadata", seek);
    seekRef.current = seek;
    seek();

    return () => {
      seekRef.current = null;
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", seek);
    };
  }, [scrubbing, showVideo]);

  // Split at the word boundary closest to the title's midpoint (by character
  // count) rather than always "first word vs. the rest" — a title longer than
  // two or three words would otherwise leave the second line far wider than
  // the first, overflowing the viewport at full slide-apart.
  const [titleLineA, titleLineB] = splitTitleBalanced(title);

  // The stage centres its contents in the full viewport, but the top of that
  // viewport is under the site header and the bottom is under the floating
  // quick-nav, so "centred" lands the composition low and pushes the scroll
  // cue behind the bar on short windows. Lifting everything by half the bar's
  // published height fixes both at once: it is what optical centring between
  // the two would be anyway, and it is a shift of the whole group, so the
  // title stays registered to the frame it sits in.
  //
  // It melts away with the expansion, since by the time the media has taken
  // the screen the title is gone and the frame should be truly centred; and it
  // is zero when there is no bar, or once the reader collapses it.
  const liftClearOfNav = "calc(var(--floating-nav-h, 0px) * (1 - var(--p, 0)) * -0.5)";

  // The bed the title sits on while the media is still a postcard. The old
  // treatment ramped up from the bottom edge and was fully transparent across
  // the middle — exactly where the title lands — so white type was left
  // fighting whichever frame the video happened to be paused on. This keeps a
  // floor of contrast everywhere, deepens at the edges so the frame reads as a
  // frame, and then lifts almost entirely as the media expands, because by
  // then the title has slid away and the footage is the whole point.
  const cardScrim: CSSProperties = {
    background:
      "radial-gradient(140% 110% at 50% 50%, transparent 30%, rgba(6,13,28,0.45) 100%), " +
      "linear-gradient(to top, rgba(6,13,28,0.8) 0%, rgba(6,13,28,0.45) 50%, rgba(6,13,28,0.3) 100%)",
    opacity: "calc(0.95 - var(--p, 0) * 0.8)",
  };

  const media =
    mediaType === "video" ? (
      <div className="relative h-full w-full pointer-events-none">
        {/* Poster base layer — visible immediately (it's what a still-budget
            visitor sees permanently, since they never get a <video> at
            all), and what fills this frame in the gap between mount and
            `showVideo` flipping true for everyone else. */}
        {posterSrc && (
          <Image
            src={posterSrc}
            alt=""
            fill
            priority
            sizes="95vw"
            className="object-cover"
          />
        )}
        {showVideo && (
          <video
            ref={videoRef}
            src={mediaSrc}
            autoPlay={!scrubbing}
            muted
            loop={!scrubbing}
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
          />
        )}
        <div className="absolute inset-0" style={cardScrim} />
      </div>
    ) : (
      <div className="relative h-full w-full">
        <Image
          src={mediaSrc}
          alt={mediaAlt}
          fill
          priority
          sizes="95vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={cardScrim} />
      </div>
    );

  return (
    <section ref={sectionRef} className="relative bg-ink text-white">
      {/* Permanent textured backdrop — the site's premium dark-band treatment,
          so once the establishing photo fades out on full expansion, the
          surface reads as intentional rather than falling through to white.

          Clipped by its own wrapper rather than by `overflow-hidden` on the
          section: an `overflow` other than `visible` makes an element a scroll
          container, and a scroll container between the sticky stage and the
          viewport would stop the stage pinning at all. As a sibling of the
          runway this clips the drifting mesh blobs without ever being one of
          the stage's ancestors. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 blueprint opacity-50" />
        <MeshBlob variant="brass" className="-top-40 -left-24 h-lg w-lg opacity-40" />
        <MeshBlob variant="steel" className="-right-24 -bottom-40 h-96 w-96 opacity-40" />
        <div className="dark-vignette" />
      </div>

      {/* The scroll runway: one viewport for the pinned stage, plus one more
          of real, scrollable distance for the expansion to play out over.
          Under reduced motion it shrinks to just the stage, which leaves no
          distance to travel and settles progress at 1 immediately. */}
      <div ref={runwayRef} className="relative z-10 h-[200dvh] motion-reduce:h-dvh">
        {/* `--start-w`/`--start-h` are the postcard's size before any
            scrolling. They scale with the breakpoint for one reason: the
            title scales too, and a headline that overhangs its own frame is
            what made this fold look accidental, with half of every word
            landing on the card and half on the street behind it. Sized like
            this the headline sits inside the frame at every width, and only
            `--grow-*` has to carry it out to the 95vw/85vh cap below. */}
        <div className="sticky top-0 flex h-dvh w-full flex-col items-center justify-center overflow-hidden [--grow-h:200px] [--grow-w:650px] [--slide:180vw] [--start-h:400px] [--start-w:300px] sm:[--start-w:420px] md:[--grow-h:400px] md:[--grow-w:1250px] md:[--slide:150vw] md:[--start-h:420px] md:[--start-w:560px] lg:[--start-w:640px]">
          {/* Establishing shot — fades out entirely as the media expands.
              Fills the pinned stage edge to edge (`object-cover`): the photo is
              3:2 and the fold is wider, so this trims a little off the top and
              bottom rather than leaving margin beside it, and the frame reads
              as one uninterrupted photograph. */}
          <div
            className="absolute inset-0 z-0"
            style={{ opacity: "calc(1 - var(--p, 0))" }}
            aria-hidden
          >
            <Image
              src={bgImageSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className="scale-[1.04] object-cover object-center blur-[2px]"
            />
            {/* Dimmed and thrown very slightly out of focus, so it reads as
                the room the postcard is sitting in rather than as a second
                photograph competing with it at equal strength. Both effects
                ride the same fade as the shot itself, so nothing is left of
                either by the time the media has taken the screen. The scale
                is only there to keep the blur from feathering the edges of
                the stage. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(100% 75% at 50% 45%, rgba(6,13,28,0.45) 0%, rgba(6,13,28,0.72) 100%)",
              }}
            />
          </div>

          {/* The expanding media itself */}
          <div
            className="absolute top-1/2 left-1/2 z-0 overflow-hidden rounded-2xl"
            style={{
              transform: `translate(-50%, -50%) translateY(${liftClearOfNav})`,
              width: "calc(var(--start-w) + var(--p, 0) * var(--grow-w))",
              height: "calc(var(--start-h) + var(--p, 0) * var(--grow-h))",
              maxWidth: "95vw",
              maxHeight: "85vh",
              // The hairline is an inset ring inside this shadow rather than a
              // `ring-1` class, because an inline `boxShadow` would overwrite
              // whatever box-shadow the class set.
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.14), 0 30px 80px -20px rgba(6,13,28,0.75), 0 8px 24px -8px rgba(6,13,28,0.5)",
            }}
          >
            {media}

            {/* Scroll cue, sitting on the card's own darkened lower edge.

                It used to hang below the card in flow and then get lifted by
                a measured amount to clear the floating quick-nav, which on any
                ordinary window height dropped it, and the label with it, into
                the middle of the picture and over the subject's face. The lift
                only ever checked the title for headroom, never the card it was
                being pulled across.

                Anchored inside the frame it needs no measurement at all: it
                lands on the one band of the card the scrim keeps dark, and it
                cannot collide with the nav, the title, or the media. */}
            {scrollHint && (
              <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center px-4">
                <ScrollHint
                  style={{ transform: "translateX(calc(var(--p, 0) * var(--slide)))" }}
                >
                  {scrollHint}
                </ScrollHint>
              </div>
            )}
          </div>

          {/* Real, single heading for SEO/assistive tech — the split halves
              below are a purely decorative animated echo of the same text. */}
          {title && <h1 className="sr-only">{title}</h1>}
          {/* The eyebrow belongs above the headline it labels, which is also
              the only spot on this stage that is never contested: below the
              title is the card's lower edge, where the scroll cue lives. It
              stays outside the `aria-hidden` echo below so it is still read
              out. */}
          <div
            className="relative z-10 flex w-full flex-col items-center gap-2 text-center sm:gap-3"
            style={{ transform: `translateY(${liftClearOfNav})` }}
          >
            {eyebrow && (
              <p
                className="eyebrow text-amber [text-shadow:0_2px_12px_rgba(6,13,28,0.75)]"
                style={{ transform: "translateX(calc(var(--p, 0) * var(--slide) * -1))" }}
              >
                {eyebrow}
              </p>
            )}
            <div
              className={`flex w-full flex-col items-center justify-center gap-3 sm:gap-4 ${
                textBlend ? "mix-blend-difference" : "mix-blend-normal"
              }`}
              aria-hidden
            >
              <span
                className="font-display text-4xl font-extrabold tracking-tight text-white [text-shadow:0_2px_28px_rgba(6,13,28,0.55)] sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ transform: "translateX(calc(var(--p, 0) * var(--slide) * -1))" }}
              >
                {titleLineA}
              </span>
              <span
                className="font-display text-4xl font-extrabold tracking-tight text-white [text-shadow:0_2px_28px_rgba(6,13,28,0.55)] sm:text-5xl md:text-6xl lg:text-7xl"
                style={{ transform: "translateX(calc(var(--p, 0) * var(--slide)))" }}
              >
                {titleLineB}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Revealed copy. Sits directly after the runway, so it comes into view
          on exactly the frame the stage unpins. */}
      <div className="relative z-10 w-full px-6 py-10 md:py-16">{children}</div>
    </section>
  );
}

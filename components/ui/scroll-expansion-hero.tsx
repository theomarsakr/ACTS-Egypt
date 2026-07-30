"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  /** Describes the expanding photo/video for assistive tech; omit if purely atmospheric. */
  mediaAlt?: string;
  posterSrc?: string;
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
 * grows to fill the screen as the visitor scrolls, before handing scroll back
 * to the page. It owns window wheel/touch/scroll while collapsed, which only
 * makes sense as the very first thing on a page — mounted anywhere else it
 * would hijack scrolling before the visitor ever reaches it.
 *
 * Renders the fully expanded, fully revealed state immediately under
 * prefers-reduced-motion, with no scroll-jacking at all — the same static-
 * fallback contract every other motion component on this site follows.
 */
export default function ScrollExpandMedia({
  mediaType = "image",
  mediaSrc,
  mediaAlt = "",
  posterSrc,
  bgImageSrc,
  eyebrow,
  title,
  scrollHint = "Scroll to explore",
  textBlend,
  children,
}: ScrollExpandMediaProps) {
  const reduced = useReducedMotion();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [isMobileState, setIsMobileState] = useState(false);
  const touchStartY = useRef(0);
  // Mirrors `mediaFullyExpanded` for `handleScroll` below, but updates
  // synchronously — React batches the state update from the same click event
  // that needs this to already be true, so by the time a re-render would
  // land, the browser's own scroll-to-fragment may already have happened (or
  // been fought off) inside that same event dispatch.
  const introFinishedRef = useRef(false);

  useEffect(() => {
    // Keeps `introFinishedRef` (read synchronously by `handleScroll`) and
    // `mediaFullyExpanded` (the render state) always in lockstep — every
    // path that flips one must flip the other, or `handleScroll` acts on a
    // stale answer.
    const setExpanded = (value: boolean) => {
      introFinishedRef.current = value;
      setMediaFullyExpanded(value);
    };

    if (reduced) {
      setScrollProgress(1);
      setExpanded(true);
      setShowContent(true);
      return;
    }

    const advance = (delta: number) => {
      setScrollProgress((prev) => {
        const next = Math.min(Math.max(prev + delta, 0), 1);
        if (next >= 1) {
          setExpanded(true);
          setShowContent(true);
        } else if (next < 0.75) {
          setShowContent(false);
        }
        return next;
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        advance(e.deltaY * 0.0009);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY.current) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        // Scrolling back up (deltaY < 0) gets extra sensitivity so collapsing
        // the media feels as responsive as expanding it did.
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        advance(deltaY * scrollFactor);
        touchStartY.current = touchY;
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = 0;
    };

    const handleScroll = () => {
      if (!introFinishedRef.current) window.scrollTo(0, 0);
    };

    // A same-page anchor link (e.g. the quick-nav dock) jumping straight to a
    // section further down is a deliberate navigation, not the visitor
    // continuing to scroll past an unfinished hero — without this,
    // `handleScroll` above fights it, snapping the page back to 0 on every
    // tick of the browser's scroll-to-fragment animation, and the jump
    // silently does nothing. Treat it the same as reduced-motion: skip
    // straight to "done". Caught on click (capture phase, before Next's own
    // <Link> handler runs) rather than via the `hashchange` event: <Link>
    // updates the URL through the History API, which — unlike an ordinary
    // anchor navigation — never fires `hashchange`. The ref (not state) is
    // what `handleScroll` reads, specifically so this takes effect before
    // React's batched re-render — which could otherwise land after <Link>'s
    // own handler has already tried to scroll, within the same click.
    const finishIntro = () => {
      setScrollProgress(1);
      setExpanded(true);
      setShowContent(true);
    };
    const handleClickCapture = (e: MouseEvent) => {
      if (introFinishedRef.current) return;
      const anchor = (e.target as Element)?.closest?.("a[href*='#']");
      if (anchor) finishIntro();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("hashchange", finishIntro);
    document.addEventListener("click", handleClickCapture, true);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("hashchange", finishIntro);
      document.removeEventListener("click", handleClickCapture, true);
    };
  }, [mediaFullyExpanded, reduced]);

  useEffect(() => {
    const checkMobile = () => setIsMobileState(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  // Split at the word boundary closest to the title's midpoint (by character
  // count) rather than always "first word vs. the rest" — a title longer than
  // two or three words would otherwise leave the second line far wider than
  // the first, overflowing the viewport at full slide-apart.
  const [titleLineA, titleLineB] = splitTitleBalanced(title);

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-start overflow-hidden bg-ink text-white">
      {/* Permanent textured backdrop — the site's premium dark-band treatment,
          so once the establishing photo fades out on full expansion, the
          surface reads as intentional rather than falling through to white. */}
      <div className="absolute inset-0 blueprint opacity-50" aria-hidden />
      <div
        className="mesh mesh-brass -top-40 -left-24 h-lg w-lg opacity-40"
        aria-hidden
      />
      <div
        className="mesh mesh-steel -right-24 -bottom-40 h-96 w-96 opacity-40"
        aria-hidden
      />
      <div className="dark-vignette" aria-hidden />

      {/* Establishing shot — fades out entirely as the media expands. */}
      <motion.div
        className="absolute inset-0 z-0 h-full"
        initial={{ opacity: 1 }}
        animate={{ opacity: reduced ? 0 : 1 - scrollProgress }}
        transition={{ duration: 0.1 }}
        aria-hidden
      >
        <Image
          src={bgImageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/80 to-navy/40 rtl:bg-linear-to-l" />
      </motion.div>

      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="relative flex h-dvh w-full flex-col items-center justify-center">
          {/* The expanding media itself */}
          <div
            className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl"
            style={{
              width: `${mediaWidth}px`,
              height: `${mediaHeight}px`,
              maxWidth: "95vw",
              maxHeight: "85vh",
              boxShadow:
                "0 30px 80px -20px rgba(6,13,28,0.65), 0 8px 24px -8px rgba(6,13,28,0.4)",
            }}
          >
            {mediaType === "video" ? (
              <div className="relative h-full w-full pointer-events-none">
                <video
                  src={mediaSrc}
                  poster={posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="h-full w-full rounded-xl object-cover"
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
                />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-linear-to-t from-ink/70 via-ink/20 to-transparent"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: reduced ? 0.55 : 0.8 - scrollProgress * 0.35 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            ) : (
              <div className="relative h-full w-full">
                <Image
                  src={mediaSrc}
                  alt={mediaAlt}
                  fill
                  priority
                  sizes="95vw"
                  className="rounded-xl object-cover"
                />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-linear-to-t from-ink/70 via-ink/20 to-transparent"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: reduced ? 0.55 : 0.8 - scrollProgress * 0.35 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            )}

            {(eyebrow || scrollHint) && (
              <div className="relative z-10 mt-4 flex flex-col items-center text-center">
                {eyebrow && (
                  <p
                    className="eyebrow justify-center text-amber [&::before]:hidden"
                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                  >
                    {eyebrow}
                  </p>
                )}
                {scrollHint && (
                  <p
                    className="mt-2 flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] text-white/60 uppercase"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    {scrollHint}
                    <ChevronDown size={14} className="animate-float" aria-hidden />
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Real, single heading for SEO/assistive tech — the split halves
              below are a purely decorative animated echo of the same text. */}
          {title && <h1 className="sr-only">{title}</h1>}
          <div
            className={`relative z-10 flex w-full flex-col items-center justify-center gap-3 text-center sm:gap-4 ${
              textBlend ? "mix-blend-difference" : "mix-blend-normal"
            }`}
            aria-hidden
          >
            <motion.span
              className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ transform: `translateX(-${textTranslateX}vw)` }}
            >
              {titleLineA}
            </motion.span>
            <motion.span
              className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ transform: `translateX(${textTranslateX}vw)` }}
            >
              {titleLineB}
            </motion.span>
          </div>
        </div>

        <motion.div
          className="w-full px-6 py-10 md:py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.7 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

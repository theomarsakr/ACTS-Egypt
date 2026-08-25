import Image from "next/image";

/**
 * The ACTS lockup as a card-corner mark, sized to sit on the same line as a
 * card's number or icon so it never meets a line of copy.
 *
 * Two things it handles that a bare <Image> would not:
 *
 *   - Surface. `light` (the black-on-white lockup) is invisible on navy and
 *     `dark` (the watermark cut, whose saturation is boosted in the file) is
 *     invisible on white, so the caller has to say which ground it is on.
 *   - The strapline. The box crops "Advanced Company For Trading Services"
 *     off the bottom of the lockup: at 104px wide that line renders as a few
 *     illegible pixels, and a smudge under the mark reads as a rendering
 *     fault rather than as type.
 *
 * It is decorative on every card that uses it — each one already names itself
 * in a heading, and the page is already the company's — so it is hidden from
 * assistive tech rather than repeating "ACTS" a dozen times down the page.
 */
export default function CardLogoMark({
  surface = "light",
  width = 104,
  className = "",
}: {
  surface?: "light" | "dark";
  /** Rendered width in px. 104 is the standard card corner mark; drop it on a
   *  narrow card (the quote page's step tiles sit in a max-w-2xl column) where
   *  the full-size mark would outweigh the label it sits beside. */
  width?: number;
  /** For cards that only have room for the mark at some widths. */
  className?: string;
}) {
  const dark = surface === "dark";
  // The lockup renders 422/1330 as tall as it is wide; the box is shorter than
  // that on purpose, cropping the strapline off the bottom. Derived from
  // `width` so the crop stays proportional at any size.
  const height = Math.round((width * 27) / 104);
  return (
    <div
      className={`pointer-events-none shrink-0 select-none overflow-hidden ${
        dark ? "opacity-60" : "opacity-75"
      } ${className}`}
      style={{ width, height }}
      aria-hidden
    >
      <Image
        src={dark ? "/images/acts-logo-watermark.png" : "/logo-transparent.png"}
        alt=""
        width={dark ? 1310 : 1330}
        height={422}
        style={{ width }}
        className="max-w-none"
      />
    </div>
  );
}

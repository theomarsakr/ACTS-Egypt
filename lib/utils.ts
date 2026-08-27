import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* tailwind-merge has to be told about the `text-fluid-*` font sizes, because
   it cannot see the @theme block that creates them.

   Its default rule for an unrecognised `text-<value>` is "this is a color",
   so `text-fluid-h2` was being filed in the same conflict group as
   `text-navy` — and in `cn("text-balance", "text-fluid-h2 …", "text-navy")`
   the later class won and the SIZE WAS DROPPED ENTIRELY. Every heading built
   through <SectionHeading> therefore rendered at the inherited 16px no matter
   which `tier` it asked for, which is what flattened the section headers
   across the site: the title, its subtitle and its lede all came out the same
   size. Utilities written as a plain string (PageHero's old <h1>) were never
   routed through twMerge, which is why those few kept their size and the
   defect looked cosmetic rather than systemic.

   Registering the namespace under `font-size` puts it in the right group, so
   a size and a color now coexist instead of competing. The validator matches
   the namespace rather than each token, so a new `--text-fluid-*` entry in
   globals.css works here without a second edit. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [(value: string) => value.startsWith("fluid-")] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

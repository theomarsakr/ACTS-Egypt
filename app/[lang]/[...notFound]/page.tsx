import { notFound } from "next/navigation";

/* With the app tree under [lang], unmatched URLs would otherwise fall through
   to Next's unstyled default 404. This catch-all routes them to the branded
   not-found boundary inside the locale layout. */
export default function CatchAll(): never {
  notFound();
}

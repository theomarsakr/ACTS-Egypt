// Simple line-art icons for the three principal brands (light theme).
const blue = "#1e5eff";
const gray = "#9ca3af";

export default function BrandIcon({
  slug,
  size = 96,
}: {
  slug: string;
  size?: number;
}) {
  if (slug === "farris-engineering") {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" stroke={blue} strokeWidth="1.6" aria-hidden>
        <rect x="46" y="20" width="28" height="16" />
        <line x1="60" y1="20" x2="60" y2="90" stroke={gray} strokeDasharray="2 4" />
        <polyline points="50,40 70,48 50,56 70,64 50,72 70,80" strokeWidth="1.8" />
        <rect x="42" y="88" width="36" height="10" stroke={gray} />
        <line x1="54" y1="98" x2="54" y2="112" stroke={gray} />
        <line x1="66" y1="98" x2="66" y2="112" stroke={gray} />
      </svg>
    );
  }
  if (slug === "solent-pratt") {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" stroke={blue} strokeWidth="1.6" aria-hidden>
        <circle cx="60" cy="60" r="40" />
        <circle cx="60" cy="60" r="30" stroke={gray} />
        <line x1="34" y1="46" x2="86" y2="74" strokeWidth="2.2" />
        <circle cx="60" cy="60" r="4" fill={blue} stroke="none" />
        <line x1="60" y1="20" x2="60" y2="8" stroke={gray} />
        <rect x="52" y="2" width="16" height="8" stroke={gray} />
      </svg>
    );
  }
  // cwt-valve
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" stroke={blue} strokeWidth="1.6" aria-hidden>
      <line x1="12" y1="70" x2="108" y2="70" stroke={gray} />
      <path d="M42 56 L60 70 L42 84 Z M78 56 L60 70 L78 84 Z" />
      <line x1="60" y1="70" x2="60" y2="34" strokeWidth="2.2" />
      <rect x="48" y="20" width="24" height="14" stroke={gray} />
      <line x1="48" y1="27" x2="30" y2="27" stroke={gray} />
      <line x1="72" y1="27" x2="90" y2="27" stroke={gray} />
    </svg>
  );
}

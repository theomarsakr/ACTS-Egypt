// Re-mounts on navigation so every page gets a subtle entrance animation.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}

"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "motion/react";
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { cn } from "@/lib/utils";

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;

type DockProps = {
  children: React.ReactNode;
  className?: string;
  label?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};
type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  href: string;
  /** Accessible name — the visual DockLabel tooltip only exists in the DOM on hover/focus, so this keeps the link nameable at all times. */
  label: string;
  /** Marks this as the page the visitor is currently on — tints the icon and
      drops a small dot beneath it, the same "app is open" cue macOS's own
      dock uses. */
  active?: boolean;
};
type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};
type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};
/** Injected onto DockLabel/DockIcon via cloneElement — not meant to be passed directly. */
type InjectedDockChildProps = {
  width?: MotionValue<number>;
  isHovered?: MotionValue<number>;
};

type DocContextType = {
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  magnification: number;
  distance: number;
};
type DockProviderProps = {
  children: React.ReactNode;
  value: DocContextType;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error("useDock must be used within an DockProvider");
  }
  return context;
}

/**
 * Dock — a macOS-style icon dock, fixed to the bottom of the viewport: items
 * magnify toward the cursor and reveal a label tooltip on hover/focus.
 *
 * Portals to `document.body`. Every page on this site renders inside
 * `app/[lang]/template.tsx`'s `.animate-page-in` wrapper for the route
 * transition, and once a CSS transition/animation has touched an element's
 * `transform`, browsers keep reporting a matrix (never the literal keyword
 * `none`) even at rest — which establishes a containing block for any
 * `position: fixed` descendant, silently anchoring it to that wrapper
 * instead of the viewport. Portaling out of the page tree entirely sidesteps
 * it (the standard fix for any fixed-position overlay: modals, toasts, and
 * docks alike).
 */
function Dock({
  children,
  className,
  label = "Quick navigation",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: DockProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6">
      <motion.div
        style={{
          height,
          scrollbarWidth: "none",
        }}
        className="mx-2 flex max-w-full items-end overflow-x-auto"
      >
        <nav
          aria-label={label}
          onMouseMove={({ pageX }) => {
            isHovered.set(1);
            mouseX.set(pageX);
          }}
          onMouseLeave={() => {
            isHovered.set(0);
            mouseX.set(Infinity);
          }}
          className={cn(
            "mx-auto flex w-fit items-end gap-4 rounded-2xl border border-gray-200 bg-white/95 px-4 shadow-xl shadow-navy/15 backdrop-blur-xl",
            className
          )}
          style={{ height: panelHeight }}
        >
          <DockProvider value={{ mouseX, spring, distance, magnification }}>
            {children}
          </DockProvider>
        </nav>
      </motion.div>
    </div>,
    document.body
  );
}

function DockItem({ children, className, href, label, active }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { distance, magnification, mouseX, spring } = useDock();

  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [40, magnification, 40]
  );

  const width = useSpring(widthTransform, spring);

  const iconAndLabel = Children.map(children, (child) =>
    cloneElement(child as ReactElement<InjectedDockChildProps>, { width, isHovered })
  );

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="relative inline-flex aspect-square items-center justify-center"
    >
      <Link
        href={href}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        onMouseEnter={() => isHovered.set(1)}
        onMouseLeave={() => isHovered.set(0)}
        onFocus={() => isHovered.set(1)}
        onBlur={() => isHovered.set(0)}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgba(10,22,40,0.08)] transition-colors duration-200",
          active
            ? "bg-brand-light text-brand"
            : "bg-white text-gray-500 hover:bg-brand-light hover:text-brand focus-visible:bg-brand-light focus-visible:text-brand",
          className
        )}
      >
        {iconAndLabel}
      </Link>
      {active && (
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand"
        />
      )}
    </motion.div>
  );
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const { isHovered } = rest as InjectedDockChildProps;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute -top-8 left-1/2 w-fit rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold whitespace-pre text-navy shadow-lg",
            className
          )}
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  // DockItem always injects this via cloneElement; DockIcon is only ever
  // rendered as its child, so it's never actually undefined at runtime.
  const { width } = rest as Required<InjectedDockChildProps>;
  const widthTransform = useTransform(width, (val) => val / 2);

  return (
    <motion.div
      style={{ width: widthTransform }}
      className={cn("flex items-center justify-center", className)}
    >
      {children}
    </motion.div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };

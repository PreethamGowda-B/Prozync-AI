import React from "react";
import { cn } from "@/lib/utils";

interface BrandProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  showBadge?: boolean;
  isUltra?: boolean;
  animated?: boolean;
}

/**
 * Geometric, technical vector emblem for Prozync AI.
 * Distinctive, modern, neural-inspired hexagonal hexagon/P polygon.
 */
export function ProzyncLogo({
  className,
  size = "md",
  animated = false,
}: {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}) {
  const sizeMap = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none",
        sizeMap[size],
        className
      )}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-full", animated && "transition-transform duration-300 hover:scale-105")}
      >
        <defs>
          <linearGradient id="pz-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="60%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="pz-grad-accent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="pz-grad-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer subtle glow background */}
        <polygon
          points="18,2 32,10 32,26 18,34 4,26 4,10"
          fill="url(#pz-grad-glow)"
          stroke="#1E2230"
          strokeWidth="1"
        />

        {/* Outer technical facet */}
        <path
          d="M18 4L30 11V25L18 32L6 25V11L18 4Z"
          stroke="url(#pz-grad-primary)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Core 'P' / Quantum node geometry */}
        <path
          d="M13 10H21C23.7614 10 26 12.2386 26 15C26 17.7614 23.7614 20 21 20H13V26"
          stroke="url(#pz-grad-accent)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner neural connector dot */}
        <circle cx="18" cy="15" r="1.5" fill="#38BDF8" />
        <circle cx="21" cy="20" r="1.2" fill="#06B6D4" />
      </svg>
    </div>
  );
}

/**
 * Prozync AI Ultra badge - Metallic blue/cyan glowing indicator.
 */
export function ProzyncUltraBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-md",
        "bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-cyan-950/80",
        "text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      ULTRA
    </span>
  );
}

/**
 * Wordmark component: "PROZYNC" + "AI"
 */
export function ProzyncWordmark({
  className,
  size = "md",
  showAi = true,
}: {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showAi?: boolean;
}) {
  const sizeMap = {
    xs: "text-xs tracking-wider",
    sm: "text-sm tracking-wider",
    md: "text-base tracking-wider",
    lg: "text-lg tracking-wider",
    xl: "text-2xl tracking-widest",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5 font-bold select-none", className)}>
      <span
        className={cn(
          "font-mono tracking-wider font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300",
          sizeMap[size]
        )}
      >
        PROZYNC
      </span>
      {showAi && (
        <span
          className={cn(
            "font-mono font-black text-cyan-400 px-1 py-0.2 rounded bg-cyan-950/40 border border-cyan-500/20 text-[0.8em]",
            size === "xl" ? "text-base" : "text-[11px]"
          )}
        >
          AI
        </span>
      )}
    </div>
  );
}

/**
 * Complete Prozync AI Brand Header / Component.
 */
export function ProzyncBrand({
  className,
  size = "md",
  showWordmark = true,
  showBadge = true,
  isUltra = true,
  animated = true,
}: BrandProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      <ProzyncLogo size={size} animated={animated} />
      {showWordmark && <ProzyncWordmark size={size} />}
      {showBadge && isUltra && <ProzyncUltraBadge />}
    </div>
  );
}

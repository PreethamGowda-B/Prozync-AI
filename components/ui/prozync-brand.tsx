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
    xs: "w-5 h-5",
    sm: "w-6 h-6",
    md: "w-7 h-7",
    lg: "w-9 h-9",
    xl: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none",
        sizeMap[size],
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Prozync-Logo.png"
        alt="Prozync AI Logo"
        className={cn(
          "w-full h-full object-contain rounded-sm drop-shadow-sm",
          animated && "transition-transform duration-300 hover:scale-105"
        )}
      />
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

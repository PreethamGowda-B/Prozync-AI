import type { FC } from "react";

interface ProzyncAISVGProps {
  theme?: "dark" | "light";
  scale?: number;
  className?: string;
}

export const ProzyncAISVG: FC<ProzyncAISVGProps> = ({ scale = 1, className }) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/Prozync-Logo.png"
      alt="Prozync AI Logo"
      width={Math.round(189 * scale)}
      height={Math.round(194 * scale)}
      className={`object-contain inline-block ${className || ""}`}
    />
  );
};

export const HackerAISVG = ProzyncAISVG;

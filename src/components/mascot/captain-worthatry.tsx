import Image from "next/image";
import type { HTMLAttributes } from "react";

import { classNames } from "@/components/ui/class-names";

import styles from "./captain-worthatry.module.css";

type MascotSize = "small" | "medium" | "large";
type FlightState = "idle" | "banked" | "level";

const sizeClasses: Record<MascotSize, string | undefined> = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
};

export type CaptainWorthATryProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  animated?: boolean;
  decorative?: boolean;
  label?: string;
  size?: MascotSize;
  flightState?: FlightState;
};

export function CaptainWorthATry({
  animated = true,
  className,
  decorative = false,
  flightState = "idle",
  label = "Captain WorthATry, a tiny retro biplane",
  size = "medium",
  ...props
}: CaptainWorthATryProps) {
  return (
    <div
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
      className={classNames(
        styles.mascot,
        sizeClasses[size],
        animated && styles.animated,
        flightState === "banked" && styles.banked,
        flightState === "level" && styles.level,
        className,
      )}
      role={decorative ? undefined : "img"}
      {...props}
    >
      <div className={styles.canvas}>
        <Image
          alt=""
          className={styles.aircraft}
          draggable={false}
          fill
          priority={false}
          sizes="(max-width: 640px) 40vw, 208px"
          src="/assets/captain-worthatry.png"
          unoptimized
        />
        <span aria-hidden="true" className={styles.propellerAssembly}>
          <span className={styles.rotor} />
          <span className={styles.hub} />
        </span>
      </div>
    </div>
  );
}

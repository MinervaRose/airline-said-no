import type { HTMLAttributes } from "react";

import { classNames } from "./class-names";
import styles from "./layout.module.css";

type Gap = "sm" | "md" | "lg" | "xl";

const gapClasses: Record<Gap, string | undefined> = {
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
  xl: styles.gapXl,
};

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  width?: "content" | "reading";
};

export function Container({
  className,
  width = "content",
  ...props
}: ContainerProps) {
  return (
    <div
      className={classNames(
        styles.container,
        width === "reading" && styles.reading,
        className,
      )}
      {...props}
    />
  );
}

type StackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: Gap;
};

export function Stack({ className, gap = "md", ...props }: StackProps) {
  return (
    <div
      className={classNames(styles.stack, gapClasses[gap], className)}
      {...props}
    />
  );
}

type ClusterProps = HTMLAttributes<HTMLDivElement> & {
  gap?: Gap;
};

export function Cluster({ className, gap = "md", ...props }: ClusterProps) {
  return (
    <div
      className={classNames(styles.cluster, gapClasses[gap], className)}
      {...props}
    />
  );
}

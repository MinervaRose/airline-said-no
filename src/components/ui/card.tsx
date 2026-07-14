import type { HTMLAttributes } from "react";

import { classNames } from "./class-names";
import styles from "./card.module.css";

type CardPadding = "compact" | "comfortable";
type CardVariant = "elevated" | "outlined" | "accent";

const paddingClasses: Record<CardPadding, string | undefined> = {
  compact: styles.compact,
  comfortable: styles.comfortable,
};

const variantClasses: Record<CardVariant, string | undefined> = {
  elevated: undefined,
  outlined: styles.outlined,
  accent: styles.accent,
};

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: CardPadding;
  variant?: CardVariant;
};

export function Card({
  className,
  padding = "comfortable",
  variant = "elevated",
  ...props
}: CardProps) {
  return (
    <div
      className={classNames(
        styles.card,
        paddingClasses[padding],
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

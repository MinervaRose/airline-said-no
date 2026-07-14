import type { HTMLAttributes } from "react";

import { classNames } from "./class-names";
import styles from "./typography.module.css";

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingSize = "display" | "title" | "section";

const headingSizes: Record<HeadingSize, string | undefined> = {
  display: styles.display,
  title: styles.title,
  section: styles.section,
};

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
  size?: HeadingSize;
};

export function Heading({
  className,
  level = 2,
  size = "title",
  ...props
}: HeadingProps) {
  const Element: `h${HeadingLevel}` = `h${level}`;

  return (
    <Element
      className={classNames(styles.heading, headingSizes[size], className)}
      {...props}
    />
  );
}

export function Eyebrow({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={classNames(styles.eyebrow, className)} {...props} />;
}

type TextSize = "sm" | "md" | "lg";
type TextTone = "default" | "muted" | "inverse";

const textSizes: Record<TextSize, string | undefined> = {
  sm: styles.textSm,
  md: styles.textMd,
  lg: styles.textLg,
};

const textTones: Record<TextTone, string | undefined> = {
  default: undefined,
  muted: styles.muted,
  inverse: styles.inverse,
};

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  size?: TextSize;
  tone?: TextTone;
};

export function Text({
  className,
  size = "md",
  tone = "default",
  ...props
}: TextProps) {
  return (
    <p
      className={classNames(
        styles.text,
        textSizes[size],
        textTones[tone],
        className,
      )}
      {...props}
    />
  );
}

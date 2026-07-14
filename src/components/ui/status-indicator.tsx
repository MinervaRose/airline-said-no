import type { HTMLAttributes } from "react";

import { classNames } from "./class-names";
import styles from "./status-indicator.module.css";

type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const toneClasses: Record<StatusTone, string | undefined> = {
  neutral: styles.neutral,
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusTone;
};

export function StatusIndicator({
  children,
  className,
  tone = "neutral",
  ...props
}: StatusIndicatorProps) {
  return (
    <span
      className={classNames(styles.status, toneClasses[tone], className)}
      {...props}
    >
      <span aria-hidden="true" className={styles.dot} />
      {children}
    </span>
  );
}

import type { ButtonHTMLAttributes } from "react";

import { classNames } from "./class-names";
import styles from "./button.module.css";

type ButtonVariant = "primary" | "secondary" | "quiet";
type ButtonSize = "medium" | "large";

const variantClasses: Record<ButtonVariant, string | undefined> = {
  primary: styles.primary,
  secondary: styles.secondary,
  quiet: styles.quiet,
};

const sizeClasses: Record<ButtonSize, string | undefined> = {
  medium: styles.medium,
  large: styles.large,
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  className,
  fullWidth = false,
  size = "medium",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        styles.button,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && styles.fullWidth,
        className,
      )}
      type={type}
      {...props}
    />
  );
}

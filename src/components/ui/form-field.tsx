import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { classNames } from "./class-names";
import styles from "./form-field.module.css";

type FieldContentProps = {
  description?: string | undefined;
  error?: string | undefined;
  id: string;
  label: string;
};

function getDescriptionIds({
  description,
  error,
  id,
}: Pick<FieldContentProps, "description" | "error" | "id">) {
  return [description && `${id}-description`, error && `${id}-error`]
    .filter(Boolean)
    .join(" ");
}

function FieldMessages({
  description,
  error,
  id,
}: Omit<FieldContentProps, "label">) {
  return (
    <>
      {description ? (
        <p className={styles.description} id={`${id}-description`}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </>
  );
}

export type TextFieldProps = FieldContentProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "aria-describedby" | "aria-invalid" | "id"
  >;

export function TextField({
  className,
  description,
  error,
  id,
  label,
  ...props
}: TextFieldProps) {
  const describedBy = getDescriptionIds({ description, error, id });

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        className={classNames(
          styles.control,
          error && styles.invalid,
          className,
        )}
        id={id}
        {...props}
      />
      <FieldMessages description={description} error={error} id={id} />
    </div>
  );
}

export type TextAreaFieldProps = FieldContentProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "aria-describedby" | "aria-invalid" | "id"
  >;

export function TextAreaField({
  className,
  description,
  error,
  id,
  label,
  ...props
}: TextAreaFieldProps) {
  const describedBy = getDescriptionIds({ description, error, id });

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <textarea
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        className={classNames(
          styles.control,
          styles.textarea,
          error && styles.invalid,
          className,
        )}
        id={id}
        {...props}
      />
      <FieldMessages description={description} error={error} id={id} />
    </div>
  );
}

"use client";

import type { ChangeEvent, DragEvent, FocusEvent } from "react";
import { useRef, useState } from "react";

import { Card } from "@/components/ui/card";
import { classNames } from "@/components/ui/class-names";

import styles from "./rejection-input.module.css";
import {
  formatFileSize,
  type InputError,
  validateFiles,
  validatePastedText,
} from "./validation";

type InputMode = "file" | "text";

const acceptedFileTypes =
  ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg";

function fileTypeLabel(file: File): string {
  return file.name.split(".").pop()?.toUpperCase() ?? "FILE";
}

function InputErrorMessage({ error }: { error: InputError }) {
  return (
    <div className={styles.error} role="alert">
      <span aria-hidden="true" className={styles.errorMark}>
        !
      </span>
      <div>
        <p className={styles.errorMessage}>{error.message}</p>
        <p className={styles.errorDetail}>{error.detail}</p>
      </div>
    </div>
  );
}

export function RejectionInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<InputMode>("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [error, setError] = useState<InputError | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function clearFile() {
    setSelectedFile(null);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function selectMode(nextMode: InputMode) {
    if (nextMode === mode) {
      return;
    }

    clearFile();
    setPastedText("");
    setError(null);
    setIsDragging(false);
    setMode(nextMode);
  }

  function acceptFiles(files: readonly File[]) {
    const nextError = validateFiles(files);

    if (nextError) {
      clearFile();
      setError(nextError);
      return;
    }

    setSelectedFile(files[0] ?? null);
    setPastedText("");
    setError(null);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    acceptFiles(Array.from(event.target.files ?? []));
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    acceptFiles(Array.from(event.dataTransfer.files));
  }

  function handleTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const nextText = event.target.value;
    setPastedText(nextText);
    setSelectedFile(null);

    if (nextText.trim().length > 0) {
      setError(null);
    }
  }

  function handleTextBlur(event: FocusEvent<HTMLTextAreaElement>) {
    setError(validatePastedText(event.target.value));
  }

  return (
    <Card
      aria-labelledby="rejection-input-title"
      className={styles.panel}
      padding="comfortable"
    >
      <header className={styles.header}>
        <p className={styles.kicker}>Your rejection</p>
        <h2 className={styles.title} id="rejection-input-title">
          How would you like to share it?
        </h2>
      </header>

      <div
        aria-label="Rejection input type"
        className={styles.modeSwitch}
        role="group"
      >
        <button
          aria-pressed={mode === "file"}
          className={styles.modeButton}
          onClick={() => selectMode("file")}
          type="button"
        >
          Upload one rejection document
        </button>
        <button
          aria-pressed={mode === "text"}
          className={styles.modeButton}
          onClick={() => selectMode("text")}
          type="button"
        >
          Paste rejection text
        </button>
      </div>

      {mode === "file" ? (
        <div>
          {selectedFile ? (
            <div className={styles.selectedFile}>
              <div className={styles.fileTicket}>
                <span aria-hidden="true" className={styles.fileMark}>
                  {fileTypeLabel(selectedFile)}
                </span>
                <div className={styles.fileDetails}>
                  <p className={styles.fileName}>{selectedFile.name}</p>
                  <p className={styles.fileMeta}>
                    {formatFileSize(selectedFile.size)} · Document ready
                  </p>
                </div>
                <button
                  aria-label={`Remove ${selectedFile.name}`}
                  className={styles.removeButton}
                  onClick={clearFile}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label
              className={classNames(
                styles.dropzone,
                isDragging && styles.dragging,
              )}
              htmlFor="rejection-file"
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
            >
              <input
                accept={acceptedFileTypes}
                className={styles.fileInput}
                id="rejection-file"
                onChange={handleFileChange}
                ref={fileInputRef}
                type="file"
              />
              <span className={styles.dropContent}>
                <span aria-hidden="true" className={styles.uploadMark}>
                  <svg fill="none" viewBox="0 0 24 24">
                    <path
                      d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
                      stroke="currentColor"
                      strokeLinecap="square"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                <span className={styles.dropTitle}>
                  Drop your rejection here
                </span>
                <span className={styles.supportCopy}>
                  or <span className={styles.dropAction}>choose a file</span>
                </span>
                <span className={styles.supportCopy}>
                  PDF, PNG, JPG or JPEG · 20 MB maximum
                </span>
              </span>
            </label>
          )}
        </div>
      ) : (
        <div>
          <label className={styles.dropTitle} htmlFor="rejection-text">
            Paste the airline’s rejection
          </label>
          <textarea
            aria-describedby={error ? "rejection-error" : undefined}
            aria-invalid={error ? true : undefined}
            className={styles.textArea}
            id="rejection-text"
            onBlur={handleTextBlur}
            onChange={handleTextChange}
            placeholder="Paste the rejection email or message here…"
            value={pastedText}
          />
          <div className={styles.textFooter}>
            <p className={styles.textState}>
              {pastedText.trim().length > 0 ? "Text ready" : ""}
            </p>
            {pastedText.length > 0 ? (
              <button
                className={styles.clearTextButton}
                onClick={() => {
                  setPastedText("");
                  setError(null);
                }}
                type="button"
              >
                Clear text
              </button>
            ) : null}
          </div>
        </div>
      )}

      {error ? (
        <div id="rejection-error">
          <InputErrorMessage error={error} />
        </div>
      ) : null}
    </Card>
  );
}

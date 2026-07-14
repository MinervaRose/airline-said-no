import { describe, expect, it } from "vitest";

import {
  formatFileSize,
  MAX_FILE_SIZE_BYTES,
  validateFiles,
  validatePastedText,
} from "./validation";

describe("rejection input validation", () => {
  it.each([
    ["rejection.pdf", "application/pdf"],
    ["rejection.png", "image/png"],
    ["rejection.jpg", "image/jpeg"],
    ["rejection.JPEG", "image/jpeg"],
    ["scan.pdf", ""],
  ])("accepts supported file %s", (name, type) => {
    const file = new File(["rejection"], name, { type });

    expect(validateFiles([file])).toBeNull();
  });

  it("rejects unsupported files with the approved copy", () => {
    const file = new File(["rejection"], "rejection.txt", {
      type: "text/plain",
    });

    expect(validateFiles([file])).toEqual({
      message: "I’m afraid I haven’t learnt to read that chart just yet.",
      detail: "Choose a PDF, PNG, JPG or JPEG file.",
    });
  });

  it("rejects files larger than 4 MB", () => {
    const file = new File(["rejection"], "rejection.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(file, "size", { value: MAX_FILE_SIZE_BYTES + 1 });

    expect(validateFiles([file])?.detail).toBe(
      "Choose a file no larger than 4 MB.",
    );
  });

  it("rejects multiple files", () => {
    const files = [
      new File(["one"], "one.pdf", { type: "application/pdf" }),
      new File(["two"], "two.pdf", { type: "application/pdf" }),
    ];

    expect(validateFiles(files)?.detail).toBe(
      "Choose one rejection document at a time.",
    );
  });

  it("rejects empty and whitespace-only pasted text", () => {
    expect(validatePastedText(" ")?.detail).toBe(
      "Paste the airline’s rejection text before continuing.",
    );
    expect(validatePastedText("Delayed flight rejected")).toBeNull();
  });

  it("formats file sizes for display", () => {
    expect(formatFileSize(850)).toBe("1 KB");
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe("1.5 MB");
  });
});

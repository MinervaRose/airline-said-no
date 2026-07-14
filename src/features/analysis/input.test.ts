import { describe, expect, it } from "vitest";

import {
  AnalysisInputError,
  MAX_ANALYSIS_FILE_SIZE_BYTES,
  parseAnalysisFormData,
  toOpenAIContent,
} from "./input";

describe("parseAnalysisFormData", () => {
  it("accepts and trims pasted text", async () => {
    const formData = new FormData();
    formData.set("text", "  Airline rejection  ");

    await expect(parseAnalysisFormData(formData)).resolves.toEqual({
      kind: "text",
      text: "Airline rejection",
    });
  });

  it("rejects simultaneous file and text inputs", async () => {
    const formData = new FormData();
    formData.set("text", "Rejection");
    formData.set(
      "file",
      new File(["image"], "rejection.png", { type: "image/png" }),
    );

    await expect(parseAnalysisFormData(formData)).rejects.toMatchObject({
      code: "invalid_input",
    });
  });

  it("rejects unsupported files", async () => {
    const formData = new FormData();
    formData.set(
      "file",
      new File(["email"], "rejection.txt", { type: "text/plain" }),
    );

    await expect(parseAnalysisFormData(formData)).rejects.toMatchObject({
      code: "unsupported_file",
    });
  });

  it("rejects oversized files before reading their bytes", async () => {
    const formData = new FormData();
    const oversized = new File(
      [new Uint8Array(MAX_ANALYSIS_FILE_SIZE_BYTES + 1)],
      "large.pdf",
      {
        type: "application/pdf",
      },
    );
    formData.set("file", oversized);

    await expect(parseAnalysisFormData(formData)).rejects.toBeInstanceOf(
      AnalysisInputError,
    );
  });
});

describe("toOpenAIContent", () => {
  it("uses input_file for PDFs", () => {
    expect(
      toOpenAIContent({
        kind: "file",
        filename: "rejection.pdf",
        mimeType: "application/pdf",
        bytes: new Uint8Array([1, 2, 3]),
      }),
    ).toEqual([
      expect.objectContaining({
        type: "input_file",
        filename: "rejection.pdf",
        file_data: "data:application/pdf;base64,AQID",
      }),
    ]);
  });

  it("uses high-detail vision input for images", () => {
    expect(
      toOpenAIContent({
        kind: "file",
        filename: "rejection.jpg",
        mimeType: "image/jpeg",
        bytes: new Uint8Array([1, 2, 3]),
      }),
    ).toEqual([
      {
        type: "input_image",
        image_url: "data:image/jpeg;base64,AQID",
        detail: "high",
      },
    ]);
  });
});

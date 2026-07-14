import { describe, expect, it } from "vitest";

import {
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

    await expect(parseAnalysisFormData(formData)).rejects.toMatchObject({
      code: "file_too_large",
      message: "Choose a file no larger than 4 MB.",
    });
  });

  it.each([
    ["rejection.pdf", "application/pdf", [0x25, 0x50, 0x44, 0x46]],
    [
      "rejection.png",
      "image/png",
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    ],
    ["rejection.jpg", "image/jpeg", [0xff, 0xd8, 0xff]],
    ["rejection.jpeg", "image/jpeg", [0xff, 0xd8, 0xff]],
  ])("accepts verified %s file content", async (name, type, signature) => {
    const formData = new FormData();
    formData.set("file", new File([new Uint8Array(signature)], name, { type }));

    await expect(parseAnalysisFormData(formData)).resolves.toMatchObject({
      kind: "file",
      filename: name,
      mimeType: type,
    });
  });

  it("rejects a file whose contents do not match its declared type", async () => {
    const formData = new FormData();
    formData.set(
      "file",
      new File(["not a PDF"], "rejection.pdf", { type: "application/pdf" }),
    );

    await expect(parseAnalysisFormData(formData)).rejects.toMatchObject({
      code: "unsupported_file",
    });
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

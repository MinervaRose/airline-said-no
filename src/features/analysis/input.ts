import { MAX_UPLOAD_SIZE_BYTES, MAX_UPLOAD_SIZE_LABEL } from "@/config/uploads";

export const MAX_ANALYSIS_FILE_SIZE_BYTES = MAX_UPLOAD_SIZE_BYTES;

const supportedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

const supportedExtensionsByMimeType = {
  "application/pdf": new Set(["pdf"]),
  "image/jpeg": new Set(["jpg", "jpeg"]),
  "image/png": new Set(["png"]),
} as const;

function hasExpectedFileSignature(
  bytes: Uint8Array,
  mimeType: keyof typeof supportedExtensionsByMimeType,
): boolean {
  if (mimeType === "application/pdf") {
    return [0x25, 0x50, 0x44, 0x46].every(
      (value, index) => bytes[index] === value,
    );
  }

  if (mimeType === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (value, index) => bytes[index] === value,
    );
  }

  return [0xff, 0xd8, 0xff].every((value, index) => bytes[index] === value);
}

export type AnalysisInput =
  | Readonly<{ kind: "text"; text: string }>
  | Readonly<{
      kind: "file";
      filename: string;
      mimeType: "application/pdf" | "image/jpeg" | "image/png";
      bytes: Uint8Array;
    }>;

export type AnalysisInputErrorCode =
  "invalid_input" | "unsupported_file" | "file_too_large";

export class AnalysisInputError extends Error {
  constructor(
    readonly code: AnalysisInputErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AnalysisInputError";
  }
}

export async function parseAnalysisFormData(
  formData: FormData,
): Promise<AnalysisInput> {
  const textEntries = formData.getAll("text");
  const fileEntries = formData.getAll("file");

  if (textEntries.length > 1 || fileEntries.length > 1) {
    throw new AnalysisInputError(
      "invalid_input",
      "Submit one rejection document or one pasted rejection.",
    );
  }

  const textEntry = textEntries[0];
  const fileEntry = fileEntries[0];
  const text = typeof textEntry === "string" ? textEntry.trim() : "";
  const file =
    fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

  if (
    (text.length > 0 && file !== null) ||
    (text.length === 0 && file === null)
  ) {
    throw new AnalysisInputError(
      "invalid_input",
      "Submit either one rejection document or pasted rejection text.",
    );
  }

  if (text.length > 0) {
    return { kind: "text", text };
  }

  if (!file) {
    throw new AnalysisInputError("invalid_input", "The input is empty.");
  }

  if (file.size > MAX_ANALYSIS_FILE_SIZE_BYTES) {
    throw new AnalysisInputError(
      "file_too_large",
      `Choose a file no larger than ${MAX_UPLOAD_SIZE_LABEL}.`,
    );
  }

  const mimeType = file.type as keyof typeof supportedExtensionsByMimeType;
  const extension = file.name.split(".").pop()?.toLowerCase();
  const hasSupportedExtension =
    extension !== undefined &&
    supportedExtensionsByMimeType[mimeType]?.has(extension);

  if (!supportedMimeTypes.has(file.type) || !hasSupportedExtension) {
    throw new AnalysisInputError(
      "unsupported_file",
      "Choose a PDF, PNG, JPG or JPEG file.",
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  if (!hasExpectedFileSignature(bytes, mimeType)) {
    throw new AnalysisInputError(
      "unsupported_file",
      "The file contents do not match a supported PDF, PNG, JPG or JPEG document.",
    );
  }

  return {
    kind: "file",
    filename: file.name,
    mimeType,
    bytes,
  };
}

export function toOpenAIContent(input: AnalysisInput): ResponseInputContent[] {
  if (input.kind === "text") {
    return [{ type: "input_text", text: input.text }];
  }

  const dataUrl = `data:${input.mimeType};base64,${Buffer.from(input.bytes).toString("base64")}`;

  if (input.mimeType === "application/pdf") {
    return [
      {
        type: "input_file",
        filename: input.filename,
        file_data: dataUrl,
        detail: "auto",
      },
    ];
  }

  return [{ type: "input_image", image_url: dataUrl, detail: "high" }];
}
import type { ResponseInputContent } from "openai/resources/responses/responses";

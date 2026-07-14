export const MAX_ANALYSIS_FILE_SIZE_BYTES = 20 * 1024 * 1024;

const supportedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

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
      "Choose a file no larger than 20 MB.",
    );
  }

  if (!supportedMimeTypes.has(file.type)) {
    throw new AnalysisInputError(
      "unsupported_file",
      "Choose a PDF, PNG, JPG or JPEG file.",
    );
  }

  return {
    kind: "file",
    filename: file.name,
    mimeType: file.type as "application/pdf" | "image/jpeg" | "image/png",
    bytes: new Uint8Array(await file.arrayBuffer()),
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

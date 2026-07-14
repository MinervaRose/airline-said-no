export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

const acceptedExtensions = new Set(["pdf", "png", "jpg", "jpeg"]);
const acceptedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

export type InputError = Readonly<{
  detail: string;
  message: string;
}>;

const uploadErrorMessage =
  "Looks like we lost that in the clouds. Let’s try another approach.";

export function validateFiles(files: readonly File[]): InputError | null {
  if (files.length !== 1) {
    return {
      message: uploadErrorMessage,
      detail: "Choose one rejection document at a time.",
    };
  }

  const file = files[0];

  if (!file) {
    return {
      message: uploadErrorMessage,
      detail: "Choose a rejection document to continue.",
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  const hasAcceptedExtension =
    extension !== undefined && acceptedExtensions.has(extension);
  const hasAcceptedMimeType =
    file.type === "" || acceptedMimeTypes.has(file.type);

  if (!hasAcceptedExtension || !hasAcceptedMimeType) {
    return {
      message: "I’m afraid I haven’t learnt to read that chart just yet.",
      detail: "Choose a PDF, PNG, JPG or JPEG file.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      message: uploadErrorMessage,
      detail: "Choose a file no larger than 20 MB.",
    };
  }

  return null;
}

export function validatePastedText(value: string): InputError | null {
  if (value.trim().length === 0) {
    return {
      message: uploadErrorMessage,
      detail: "Paste the airline’s rejection text before continuing.",
    };
  }

  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

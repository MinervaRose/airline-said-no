import type { AnalysisResult } from "@/features/analysis";

import { draftSchema, type Draft } from "./schema";

export interface DraftProvider {
  generate(analysis: AnalysisResult): Promise<unknown>;
}

export class InvalidDraftResponseError extends Error {
  constructor() {
    super("The drafting provider returned an invalid or unsupported response.");
    this.name = "InvalidDraftResponseError";
  }
}

const sensitiveValuePatterns = [
  /\b[A-Z]{2,3}\s?\d{1,4}\b/g,
  /\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/gi,
  /\b\d{4}-\d{2}-\d{2}\b/g,
  /(?:€|£|\$|\bEUR\b|\bGBP\b|\bUSD\b)\s?\d[\d,.]*/gi,
  /\b(?:Article|Regulation)\s+[A-Z0-9/().-]+/gi,
] as const;

function containsOnlyGroundedSensitiveValues(
  draft: Draft,
  analysis: AnalysisResult,
): boolean {
  const basis = JSON.stringify(analysis).toLocaleLowerCase();
  const content = `${draft.subject}\n${draft.body}`;

  return sensitiveValuePatterns.every((pattern) =>
    [...content.matchAll(pattern)].every((match) =>
      basis.includes(match[0].toLocaleLowerCase()),
    ),
  );
}

export async function generateDraft(
  analysis: AnalysisResult,
  provider: DraftProvider,
): Promise<Draft> {
  const parsed = draftSchema.safeParse(await provider.generate(analysis));

  if (
    !parsed.success ||
    !containsOnlyGroundedSensitiveValues(parsed.data, analysis)
  ) {
    throw new InvalidDraftResponseError();
  }

  return parsed.data;
}

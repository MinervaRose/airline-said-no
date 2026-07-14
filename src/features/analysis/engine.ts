import { analysisResultSchema, type AnalysisResult } from "./schema";
import type { AnalysisInput } from "./input";

export interface AnalysisProvider {
  analyze(input: AnalysisInput): Promise<unknown>;
}

export class InvalidAnalysisResponseError extends Error {
  constructor() {
    super("The analysis provider returned an invalid structured response.");
    this.name = "InvalidAnalysisResponseError";
  }
}

export async function analyzeRejection(
  input: AnalysisInput,
  provider: AnalysisProvider,
): Promise<AnalysisResult> {
  const result = analysisResultSchema.safeParse(await provider.analyze(input));

  if (!result.success) {
    throw new InvalidAnalysisResponseError();
  }

  return result.data;
}

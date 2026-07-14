import { describe, expect, it, vi } from "vitest";
import { analysisResultSchema } from "@/features/analysis";
import { validAnalysis } from "@/features/analysis/schema.test";
import { generateDraft, InvalidDraftResponseError } from "./engine";

const analysis = analysisResultSchema.parse(validAnalysis);

describe("generateDraft", () => {
  it("returns a valid grounded draft", async () => {
    const draft = {
      subject: "Request for further information",
      body: "Hello, please provide the specific cause and supporting detail. Thank you.",
    };
    await expect(
      generateDraft(analysis, { generate: vi.fn().mockResolvedValue(draft) }),
    ).resolves.toEqual(draft);
  });

  it("rejects invented sensitive values", async () => {
    await expect(
      generateDraft(analysis, {
        generate: vi.fn().mockResolvedValue({
          subject: "Flight AS999",
          body: "Please pay EUR 600 under Article 7.",
        }),
      }),
    ).rejects.toBeInstanceOf(InvalidDraftResponseError);
  });
});

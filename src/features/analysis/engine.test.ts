import { describe, expect, it, vi } from "vitest";

import { analyzeRejection, InvalidAnalysisResponseError } from "./engine";
import { validAnalysis } from "./schema.test";

describe("analyzeRejection", () => {
  it("validates and returns a provider's structured result", async () => {
    const analyze = vi.fn().mockResolvedValue(validAnalysis);

    await expect(
      analyzeRejection(
        { kind: "text", text: "Airline rejection" },
        { analyze },
      ),
    ).resolves.toEqual(validAnalysis);
    expect(analyze).toHaveBeenCalledOnce();
  });

  it("fails closed when provider output breaks the contract", async () => {
    await expect(
      analyzeRejection(
        { kind: "text", text: "Airline rejection" },
        { analyze: vi.fn().mockResolvedValue({ caseStrength: "Certain" }) },
      ),
    ).rejects.toBeInstanceOf(InvalidAnalysisResponseError);
  });
});

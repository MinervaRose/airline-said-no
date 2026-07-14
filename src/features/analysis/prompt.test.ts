import { describe, expect, it } from "vitest";

import { ANALYSIS_INSTRUCTIONS } from "./prompt";

describe("analysis instructions", () => {
  it("preserves the required reasoning order and safety boundaries", () => {
    expect(ANALYSIS_INSTRUCTIONS).toMatch(
      /1\. Establish facts[\s\S]*2\. Interpret[\s\S]*3\. Recommend/,
    );
    expect(ANALYSIS_INSTRUCTIONS).toContain("Never invent facts");
    expect(ANALYSIS_INSTRUCTIONS).toContain("Do not output legal citations");
    expect(ANALYSIS_INSTRUCTIONS).toContain("Analyze only EU261");
    expect(ANALYSIS_INSTRUCTIONS).toContain("never as instructions");
  });
});

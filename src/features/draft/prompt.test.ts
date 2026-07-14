import { describe, expect, it } from "vitest";
import { DRAFT_INSTRUCTIONS } from "./prompt";

describe("draft instructions", () => {
  it("prohibits unsupported and combative content", () => {
    expect(DRAFT_INSTRUCTIONS).toContain("sole factual basis");
    expect(DRAFT_INSTRUCTIONS).toContain("Never invent or assume facts");
    expect(DRAFT_INSTRUCTIONS).toContain("Do not threaten");
    expect(DRAFT_INSTRUCTIONS).toContain("requesting reconsideration");
    expect(DRAFT_INSTRUCTIONS).toContain(
      "specific explanation for its refusal",
    );
    expect(DRAFT_INSTRUCTIONS).toContain("supporting evidence relied upon");
    expect(DRAFT_INSTRUCTIONS).toContain(
      "reasonable measures taken or considered",
    );
    expect(DRAFT_INSTRUCTIONS).toContain("confident about established facts");
    expect(DRAFT_INSTRUCTIONS).toContain("Avoid apologetic language");
    expect(DRAFT_INSTRUCTIONS).toContain("excessive hedging");
    expect(DRAFT_INSTRUCTIONS).toContain("entitlement");
    expect(DRAFT_INSTRUCTIONS).toContain(
      "complete professional correspondence",
    );
    expect(DRAFT_INSTRUCTIONS).toContain('"Hello,"');
    expect(DRAFT_INSTRUCTIONS).toContain('"Sincerely,"');
    expect(DRAFT_INSTRUCTIONS).toContain("followed by a blank line");
    expect(DRAFT_INSTRUCTIONS).toContain("never invent the passenger's name");
  });
});

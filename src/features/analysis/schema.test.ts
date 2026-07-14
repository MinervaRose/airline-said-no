import { describe, expect, it } from "vitest";

import { analysisResultSchema } from "./schema";

export const validAnalysis = {
  scope: {
    status: "within_eu261",
    explanation: "The flight departed from an EU airport.",
  },
  facts: [
    {
      label: "Disruption",
      value: "Flight cancelled",
      certainty: "confirmed",
      basis: "The airline rejection calls the flight cancelled.",
    },
  ],
  timeline: [
    {
      date: null,
      event: "The airline cancelled the flight.",
      certainty: "confirmed",
    },
  ],
  refusalReason: {
    summary: "The airline relies on extraordinary circumstances.",
    statedReason: "Extraordinary circumstances",
  },
  interpretation: {
    summary: "The reason needs supporting detail before it can be assessed.",
    relevantEu261Principles: [
      "The airline must show the event could not have been avoided with reasonable measures.",
    ],
    caveats: ["The cause of cancellation is not described."],
  },
  missingInformation: [
    {
      item: "Cause of cancellation",
      whyItMatters: "It is needed to assess the airline's stated defence.",
    },
  ],
  evidence: {
    available: [
      {
        item: "Airline rejection",
        relevance: "Confirms the refusal and its stated reason.",
      },
    ],
    couldHelp: [
      {
        item: "Cancellation notification",
        relevance: "Could establish timing and the reason given at the time.",
      },
    ],
  },
  caseStrength: "Uncertain",
  recommendedNextMove:
    "Ask the airline for the specific cause and supporting detail.",
  rationale:
    "That information is necessary before the refusal can be assessed.",
} as const;

describe("analysisResultSchema", () => {
  it("accepts the complete ordered analysis contract", () => {
    const result = analysisResultSchema.parse(validAnalysis);

    expect(Object.keys(result)).toEqual([
      "scope",
      "facts",
      "timeline",
      "refusalReason",
      "interpretation",
      "missingInformation",
      "evidence",
      "caseStrength",
      "recommendedNextMove",
      "rationale",
    ]);
  });

  it("rejects numeric case-strength claims", () => {
    expect(() =>
      analysisResultSchema.parse({ ...validAnalysis, caseStrength: 72 }),
    ).toThrow();
  });

  it("rejects incomplete recommendations", () => {
    expect(() =>
      analysisResultSchema.parse({ ...validAnalysis, rationale: undefined }),
    ).toThrow();
  });
});

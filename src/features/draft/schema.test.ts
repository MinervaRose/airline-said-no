import { describe, expect, it } from "vitest";
import { validAnalysis } from "@/features/analysis/schema.test";
import { draftRequestSchema, draftSchema } from "./schema";

describe("draft contracts", () => {
  it("accepts only subject and body", () => {
    expect(
      draftSchema.parse({ subject: "Request for review", body: "Hello." }),
    ).toEqual({ subject: "Request for review", body: "Hello." });
    expect(() =>
      draftSchema.parse({
        subject: "Request",
        body: "Hello.",
        sendAutomatically: true,
      }),
    ).toThrow();
  });

  it("preserves the blank line after a professional closing", () => {
    expect(
      draftSchema.parse({
        subject: "Request for review",
        body: "Hello,\n\nPlease reconsider.\n\nSincerely,\n\n",
      }).body,
    ).toBe("Hello,\n\nPlease reconsider.\n\nSincerely,\n\n");
  });

  it("rejects invalid analysis input", () => {
    expect(() => draftRequestSchema.parse({ analysis: {} })).toThrow();
    expect(() =>
      draftRequestSchema.parse({ analysis: validAnalysis }),
    ).not.toThrow();
  });
});

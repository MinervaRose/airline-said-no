import { z } from "zod";

const nonEmptyText = z.string().trim().min(1);
const certaintySchema = z.enum(["confirmed", "uncertain"]);

export const analysisResultSchema = z.object({
  scope: z.object({
    status: z.enum(["within_eu261", "outside_eu261", "uncertain"]),
    explanation: nonEmptyText,
  }),
  facts: z.array(
    z.object({
      label: nonEmptyText,
      value: nonEmptyText,
      certainty: certaintySchema,
      basis: nonEmptyText,
    }),
  ),
  timeline: z.array(
    z.object({
      date: z.string().trim().nullable(),
      event: nonEmptyText,
      certainty: certaintySchema,
    }),
  ),
  refusalReason: z.object({
    summary: nonEmptyText,
    statedReason: z.string().trim().nullable(),
  }),
  interpretation: z.object({
    summary: nonEmptyText,
    relevantEu261Principles: z.array(nonEmptyText),
    caveats: z.array(nonEmptyText),
  }),
  missingInformation: z.array(
    z.object({
      item: nonEmptyText,
      whyItMatters: nonEmptyText,
    }),
  ),
  evidence: z.object({
    available: z.array(
      z.object({
        item: nonEmptyText,
        relevance: nonEmptyText,
      }),
    ),
    couldHelp: z.array(
      z.object({
        item: nonEmptyText,
        relevance: nonEmptyText,
      }),
    ),
  }),
  caseStrength: z.enum(["Strong", "Uncertain", "Weak"]),
  recommendedNextMove: nonEmptyText,
  rationale: nonEmptyText,
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

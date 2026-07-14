import { z } from "zod";
import { analysisResultSchema } from "@/features/analysis";

export const draftSchema = z
  .object({
    subject: z.string().trim().min(1).max(160),
    body: z
      .string()
      .max(5_000)
      .refine((value) => value.trim().length > 0, "Body is required"),
  })
  .strict();

export type Draft = z.infer<typeof draftSchema>;

export const draftRequestSchema = z
  .object({ analysis: analysisResultSchema })
  .strict();

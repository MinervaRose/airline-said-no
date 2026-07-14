import "server-only";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import { getServerEnvironment } from "@/config/env";

import type { AnalysisProvider } from "./engine";
import { toOpenAIContent } from "./input";
import { ANALYSIS_INSTRUCTIONS } from "./prompt";
import { analysisResultSchema } from "./schema";

export function createOpenAIAnalysisProvider(): AnalysisProvider {
  const environment = getServerEnvironment();
  const client = new OpenAI({ apiKey: environment.OPENAI_API_KEY });

  return {
    async analyze(input) {
      const response = await client.responses.parse(
        {
          model: environment.OPENAI_MODEL,
          instructions: ANALYSIS_INSTRUCTIONS,
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: "Analyze the supplied airline rejection and supporting content.",
                },
                ...toOpenAIContent(input),
              ],
            },
          ],
          reasoning: { effort: "high" },
          store: false,
          text: {
            format: zodTextFormat(analysisResultSchema, "eu261_analysis"),
            verbosity: "medium",
          },
        },
        { signal: AbortSignal.timeout(60_000) },
      );

      return response.output_parsed;
    },
  };
}

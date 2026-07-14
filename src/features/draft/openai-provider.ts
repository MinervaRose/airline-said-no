import "server-only";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import { getServerEnvironment } from "@/config/env";

import type { DraftProvider } from "./engine";
import { DRAFT_INSTRUCTIONS } from "./prompt";
import { draftSchema } from "./schema";

export function createOpenAIDraftProvider(): DraftProvider {
  const environment = getServerEnvironment();
  const client = new OpenAI({ apiKey: environment.OPENAI_API_KEY });

  return {
    async generate(analysis) {
      const response = await client.responses.parse(
        {
          model: environment.OPENAI_MODEL,
          instructions: DRAFT_INSTRUCTIONS,
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: `Write the reply using only this validated analysis:\n${JSON.stringify(analysis)}`,
                },
              ],
            },
          ],
          reasoning: { effort: "medium" },
          store: false,
          text: {
            format: zodTextFormat(draftSchema, "airline_reply_draft"),
            verbosity: "low",
          },
        },
        { signal: AbortSignal.timeout(60_000) },
      );

      return response.output_parsed;
    },
  };
}

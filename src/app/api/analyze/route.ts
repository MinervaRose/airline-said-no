import { NextResponse } from "next/server";

import { analyzeRejection, parseAnalysisFormData } from "@/features/analysis";
import { InvalidAnalysisResponseError } from "@/features/analysis/engine";
import { AnalysisInputError } from "@/features/analysis/input";
import { createOpenAIAnalysisProvider } from "@/features/analysis/openai-provider";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const input = await parseAnalysisFormData(await request.formData());
    const data = await analyzeRejection(input, createOpenAIAnalysisProvider());

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AnalysisInputError) {
      const status =
        error.code === "file_too_large"
          ? 413
          : error.code === "unsupported_file"
            ? 415
            : 400;

      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status },
      );
    }

    if (error instanceof InvalidAnalysisResponseError) {
      return NextResponse.json(
        {
          error: {
            code: "invalid_response",
            message: "We could not verify the analysis. Please try again.",
          },
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        error: {
          code: "analysis_unavailable",
          message: "We’re temporarily out of radio contact.",
        },
      },
      { status: 503 },
    );
  }
}

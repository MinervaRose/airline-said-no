import { NextResponse } from "next/server";
import { draftRequestSchema, generateDraft } from "@/features/draft";
import { InvalidDraftResponseError } from "@/features/draft/engine";
import { createOpenAIDraftProvider } from "@/features/draft/openai-provider";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const requestBody: unknown = await request.json();
    const parsedRequest = draftRequestSchema.safeParse(requestBody);

    if (!parsedRequest.success) {
      return NextResponse.json(
        {
          error: {
            code: "invalid_analysis",
            message: "The completed analysis could not be verified.",
          },
        },
        { status: 400 },
      );
    }

    const data = await generateDraft(
      parsedRequest.data.analysis,
      createOpenAIDraftProvider(),
    );
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof InvalidDraftResponseError) {
      return NextResponse.json(
        {
          error: {
            code: "invalid_draft",
            message: "We could not verify that draft. Please try again.",
          },
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        error: {
          code: "draft_unavailable",
          message: "We’re temporarily out of radio contact.",
        },
      },
      { status: 503 },
    );
  }
}

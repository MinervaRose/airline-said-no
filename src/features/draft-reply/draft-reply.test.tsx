import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { analysisResultSchema } from "@/features/analysis";
import { AnalysisResults } from "@/features/analysis-journey/analysis-results";
import { validAnalysis } from "@/features/analysis/schema.test";
import { DraftReply } from "./draft-reply";

const analysis = analysisResultSchema.parse(validAnalysis);
const generatedDraft = {
  subject: "Request for further information",
  body: "Please provide the specific cause and supporting detail.",
};
const successfulResponse = () =>
  new Response(JSON.stringify({ data: generatedDraft }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

describe("DraftReply", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("does not generate until the explicit action", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<DraftReply analysis={analysis} />);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Draft My Reply" }),
    ).toBeInTheDocument();
  });

  it("edits fields and copies the current edited content", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(successfulResponse()));
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<DraftReply analysis={analysis} />);
    fireEvent.click(screen.getByRole("button", { name: "Draft My Reply" }));
    const subject = await screen.findByLabelText("Subject");
    const body = screen.getByLabelText("Reply");
    fireEvent.change(subject, { target: { value: "My edited subject" } });
    fireEvent.change(body, { target: { value: "My edited reply." } });
    fireEvent.click(screen.getByRole("button", { name: "Copy current reply" }));
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(
        "My edited subject\n\nMy edited reply.",
      ),
    );
    expect(
      screen.getByText("Current edited reply copied."),
    ).toBeInTheDocument();
  });

  it("preserves the analysis on failure and retries", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(successfulResponse());
    vi.stubGlobal("fetch", fetchMock);
    render(<AnalysisResults result={analysis} />);
    fireEvent.click(screen.getByRole("button", { name: "Draft My Reply" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "What happened?" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try drafting again" }));
    expect(await screen.findByLabelText("Subject")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("provides no sending or export controls", () => {
    render(<DraftReply analysis={analysis} />);
    expect(
      screen.queryByRole("button", { name: /send|export|download/i }),
    ).not.toBeInTheDocument();
  });
});

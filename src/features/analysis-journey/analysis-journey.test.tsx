import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { validAnalysis } from "@/features/analysis/schema.test";

import { AnalysisJourney } from "./analysis-journey";

describe("AnalysisJourney", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("submits once, investigates, and renders validated results", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: validAnalysis }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    render(<AnalysisJourney />);

    expect(
      screen.queryByRole("button", { name: "Draft My Reply" }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Paste rejection text" }),
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: /paste the airline’s rejection/i }),
      { target: { value: "The airline rejected the claim." } },
    );
    const submit = screen.getByRole("button", {
      name: /check if “no” really means “no”/i,
    });
    fireEvent.click(submit);
    fireEvent.click(submit);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "true");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(6_000);
    });

    expect(
      screen.getByRole("heading", { name: "Best next move" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "false");
  });

  it("uses a neutral waiting state until a slow analysis is ready", async () => {
    vi.useFakeTimers();
    let resolveResponse!: (response: Response) => void;
    const pendingResponse = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(pendingResponse));
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    render(<AnalysisJourney />);

    fireEvent.click(
      screen.getByRole("button", { name: "Paste rejection text" }),
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: /paste the airline’s rejection/i }),
      { target: { value: "The airline rejected the claim." } },
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /check if “no” really means “no”/i,
      }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(6_000);
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Holding our course...",
    );
    expect(
      screen.queryByRole("heading", { name: "Best next move" }),
    ).not.toBeInTheDocument();

    resolveResponse(
      new Response(JSON.stringify({ data: validAnalysis }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    await act(async () => {
      await Promise.resolve();
    });

    expect(
      screen.getByRole("heading", { name: "Best next move" }),
    ).toBeInTheDocument();
  });

  it.each([
    ["rejection.pdf", "application/pdf", [0x25, 0x50, 0x44, 0x46]],
    [
      "rejection.png",
      "image/png",
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    ],
    ["rejection.jpg", "image/jpeg", [0xff, 0xd8, 0xff]],
  ])("completes the synthetic %s upload journey", async (name, type, bytes) => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: validAnalysis }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    render(<AnalysisJourney />);

    fireEvent.change(screen.getByLabelText(/drop your rejection here/i), {
      target: { files: [new File([new Uint8Array(bytes)], name, { type })] },
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: /check if “no” really means “no”/i,
      }),
    );

    const submittedBody = fetchMock.mock.calls[0]?.[1]?.body as FormData;
    expect((submittedBody.get("file") as File).name).toBe(name);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(6_000);
    });
    expect(
      screen.getByRole("heading", { name: "Best next move" }),
    ).toBeInTheDocument();
  });

  it("preserves the input journey after an API failure and allows retry", async () => {
    vi.useFakeTimers();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: {
              code: "analysis_unavailable",
              message: "We’re temporarily out of radio contact.",
            },
          }),
          { status: 503, headers: { "Content-Type": "application/json" } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: validAnalysis }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    render(<AnalysisJourney />);

    const submitText = () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Paste rejection text" }),
      );
      fireEvent.change(
        screen.getByRole("textbox", { name: /paste the airline’s rejection/i }),
        { target: { value: "Synthetic airline rejection." } },
      );
      fireEvent.click(
        screen.getByRole("button", {
          name: /check if “no” really means “no”/i,
        }),
      );
    };

    submitText();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "We’re temporarily out of radio contact.",
    );
    submitText();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(6_000);
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(
      screen.getByRole("heading", { name: "Best next move" }),
    ).toBeInTheDocument();
  });
});

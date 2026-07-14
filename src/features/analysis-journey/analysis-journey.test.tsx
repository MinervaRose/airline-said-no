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
});

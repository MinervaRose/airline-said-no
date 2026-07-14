import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { validAnalysis } from "@/features/analysis/schema.test";
import { analysisResultSchema } from "@/features/analysis";

import { AnalysisResults } from "./analysis-results";
import styles from "./analysis-results.module.css";

describe("AnalysisResults", () => {
  it("renders facts, interpretation, then one recommendation", () => {
    render(
      <AnalysisResults result={analysisResultSchema.parse(validAnalysis)} />,
    );

    const facts = screen.getByRole("heading", { name: "What happened?" });
    const interpretation = screen.getByRole("heading", {
      name: "Why did they say no?",
    });
    const recommendation = screen.getByRole("heading", {
      name: "Best next move",
    });

    expect(
      facts.compareDocumentPosition(interpretation) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      interpretation.compareDocumentPosition(recommendation) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getByText("Case strength: Uncertain")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Airline Said No provides information and drafting assistance. It is not legal advice.",
      ),
    ).toBeInTheDocument();
  });

  it.each([
    [
      "uncertain",
      "EU261 scope is not clear yet.",
      "The operating airline is not identified.",
    ],
    [
      "outside_eu261",
      "This appears to be outside our EU261 scope.",
      "This journey is outside the MVP's supported scope.",
    ],
  ] as const)(
    "renders a polite %s scope assessment without hiding the reasoning",
    (status, heading, explanation) => {
      const result = analysisResultSchema.parse({
        ...validAnalysis,
        scope: { status, explanation },
      });
      render(<AnalysisResults result={result} />);

      expect(screen.getByText(heading)).toBeInTheDocument();
      expect(screen.getByText(explanation)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "What’s still missing?" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Best next move" }),
      ).toBeInTheDocument();
    },
  );

  it("wraps long synthetic content within the results container", () => {
    const result = analysisResultSchema.parse({
      ...validAnalysis,
      facts: [
        {
          label: "Reference",
          value: "A".repeat(500),
          certainty: "confirmed",
          basis: "Synthetic long-content overflow check.",
        },
      ],
    });
    const { container } = render(<AnalysisResults result={result} />);
    const resultsClass = styles.results;

    expect(resultsClass).toBeDefined();

    expect(container.firstElementChild).toHaveClass(resultsClass ?? "");
    expect(screen.getByText("A".repeat(500))).toBeInTheDocument();
  });
});

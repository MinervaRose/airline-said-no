import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { validAnalysis } from "@/features/analysis/schema.test";
import { analysisResultSchema } from "@/features/analysis";

import { AnalysisResults } from "./analysis-results";

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
});

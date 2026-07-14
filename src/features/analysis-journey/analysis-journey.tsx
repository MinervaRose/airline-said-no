"use client";

import { useRef, useState } from "react";
import { CaptainWorthATry } from "@/components/mascot";
import { Card } from "@/components/ui/card";
import {
  RejectionInput,
  type RejectionSubmission,
} from "@/features/rejection-input";
import { analysisResultSchema, type AnalysisResult } from "@/features/analysis";
import pageStyles from "@/app/page.module.css";
import styles from "./analysis-journey.module.css";
import { AnalysisResults } from "./analysis-results";
import {
  INVESTIGATION_SEQUENCE_DURATION_MS,
  Investigation,
} from "./investigation";

type JourneyState = "landing" | "processing" | "results";
const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

function Landing({
  error,
  onSubmit,
}: Readonly<{
  error: string | null;
  onSubmit: (submission: RejectionSubmission) => void;
}>) {
  return (
    <section className={pageStyles.hero}>
      <div className={pageStyles.copy}>
        <p className={pageStyles.bearing}>An explainable second opinion</p>
        <h1 className={pageStyles.headline}>
          <span>Airline Said No.</span>
          <span className={pageStyles.headlineAccent}>Let’s get a yes.</span>
          <span className={pageStyles.headlineAside}>…or at least try.</span>
        </h1>
        <p className={pageStyles.intro}>
          Upload the airline’s rejection or paste the text. We’ll help you
          understand whether “No” is truly final.
        </p>
        <div className={pageStyles.captainDock}>
          <CaptainWorthATry
            className={pageStyles.captain}
            decorative
            size="large"
          />
          <p className={pageStyles.motto}>Worth a try.</p>
        </div>
      </div>
      <div className={pageStyles.inputColumn}>
        {error ? (
          <Card className={styles.requestError} padding="compact" role="alert">
            <strong>We’re temporarily out of radio contact.</strong>
            <span>{error}</span>
          </Card>
        ) : null}
        <RejectionInput onSubmit={onSubmit} />
      </div>
    </section>
  );
}

export function AnalysisJourney() {
  const [state, setState] = useState<JourneyState>("landing");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  async function submit(submission: RejectionSubmission) {
    if (inFlight.current) return;
    inFlight.current = true;
    setError(null);
    setState("processing");
    const formData = new FormData();
    if (submission.kind === "file") formData.set("file", submission.file);
    else formData.set("text", submission.text);

    try {
      const request = fetch("/api/analyze", {
        method: "POST",
        body: formData,
      }).then(async (response) => {
        const payload: unknown = await response.json();
        if (!response.ok) {
          const message =
            typeof payload === "object" &&
            payload !== null &&
            "error" in payload &&
            typeof payload.error === "object" &&
            payload.error !== null &&
            "message" in payload.error &&
            typeof payload.error.message === "string"
              ? payload.error.message
              : "Looks like we lost that in the clouds. Let’s try another approach.";
          throw new Error(message);
        }
        const data =
          typeof payload === "object" && payload !== null && "data" in payload
            ? payload.data
            : undefined;
        return analysisResultSchema.parse(data);
      });
      const [analysis] = await Promise.all([
        request,
        wait(INVESTIGATION_SEQUENCE_DURATION_MS),
      ]);
      setResult(analysis);
      setState("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Looks like we lost that in the clouds. Let’s try another approach.",
      );
      setState("landing");
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <main aria-busy={state === "processing"} className={pageStyles.page}>
      <span aria-hidden="true" className={pageStyles.routeLine} />
      <div className={pageStyles.shell}>
        <header className={pageStyles.wordmark}>
          <span aria-hidden="true" className={pageStyles.wordmarkMark} />
          Airline Said No.
        </header>
        {state === "landing" ? (
          <Landing error={error} onSubmit={submit} />
        ) : null}
        {state === "processing" ? <Investigation /> : null}
        {state === "results" && result ? (
          <AnalysisResults result={result} />
        ) : null}
        <footer className={pageStyles.footer}>
          Airline Said No provides information and drafting assistance. It is
          not legal advice.
        </footer>
      </div>
    </main>
  );
}

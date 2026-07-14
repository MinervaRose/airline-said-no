"use client";

import { useRef, useState } from "react";

import { CaptainWorthATry } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/features/analysis";
import { draftSchema, type Draft } from "@/features/draft";

import styles from "./draft-reply.module.css";

type DraftState = "idle" | "loading" | "editing" | "error";

export function DraftReply({ analysis }: { analysis: AnalysisResult }) {
  const [state, setState] = useState<DraftState>("idle");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const inFlight = useRef(false);

  async function requestDraft() {
    if (inFlight.current) return;
    inFlight.current = true;
    setState("loading");
    setFeedback(null);

    try {
      const response = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      });
      const payload: unknown = await response.json();

      if (!response.ok) throw new Error("Drafting failed");
      const data =
        typeof payload === "object" && payload !== null && "data" in payload
          ? payload.data
          : undefined;
      setDraft(draftSchema.parse(data));
      setState("editing");
    } catch {
      setState("error");
      setFeedback(
        "Looks like we lost that in the clouds. Your analysis is safe here—let’s try the draft again.",
      );
    } finally {
      inFlight.current = false;
    }
  }

  async function copyDraft() {
    if (!draft) return;

    try {
      await navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`);
      setFeedback("Current edited reply copied.");
    } catch {
      setFeedback(
        "Copy didn’t quite take off. Select the text and copy it manually.",
      );
    }
  }

  if (state === "idle") {
    return (
      <div className={styles.action}>
        <Button onClick={requestDraft} size="large">
          Draft My Reply
        </Button>
        <p>You’ll review and edit it before deciding what to do next.</p>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div aria-busy="true" className={styles.drafting} role="status">
        <CaptainWorthATry decorative size="small" />
        <div>
          <strong>Captain’s Log</strong>
          <p>Writing a calm reply...</p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={styles.failure} role="alert">
        <p>{feedback}</p>
        <Button onClick={requestDraft} variant="secondary">
          Try drafting again
        </Button>
      </div>
    );
  }

  if (!draft) return null;

  return (
    <section aria-labelledby="draft-editor-title" className={styles.editor}>
      <header className={styles.editorHeader}>
        <div>
          <p className={styles.editorKicker}>Your editable draft</p>
          <h3 id="draft-editor-title">Ready for your review</h3>
        </div>
        <Button onClick={copyDraft} variant="secondary">
          Copy current reply
        </Button>
      </header>

      <div className={styles.paper}>
        <label htmlFor="draft-subject">Subject</label>
        <input
          id="draft-subject"
          onChange={(event) =>
            setDraft((current) =>
              current ? { ...current, subject: event.target.value } : current,
            )
          }
          type="text"
          value={draft.subject}
        />
        <label htmlFor="draft-body">Reply</label>
        <textarea
          id="draft-body"
          onChange={(event) =>
            setDraft((current) =>
              current ? { ...current, body: event.target.value } : current,
            )
          }
          value={draft.body}
        />
      </div>

      <p aria-live="polite" className={styles.feedback} role="status">
        {feedback}
      </p>
      <div className={styles.signoff}>
        <CaptainWorthATry decorative size="small" />
        <p>
          May the winds be fair and gravity treat you kindly.
          <br />
          Until next time...
          <br />
          <strong>Cheerio!</strong>
        </p>
      </div>
    </section>
  );
}

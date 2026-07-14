"use client";

import { useEffect, useState } from "react";
import { CaptainWorthATry } from "@/components/mascot";
import styles from "./investigation.module.css";

export const investigationMessages = [
  "Flying to your help...",
  "Reading your paperwork...",
  "Looking for wiggle room...",
  'Checking if "No" really means "No"...',
  "Plotting our next course...",
] as const;

export function Investigation({ arrived = false }: { arrived?: boolean }) {
  const [messageIndex, setMessageIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(
      () =>
        setMessageIndex((current) =>
          Math.min(current + 1, investigationMessages.length - 1),
        ),
      750,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      aria-labelledby="investigation-title"
      className={styles.investigation}
    >
      <div aria-hidden="true" className={styles.sky}>
        <span className={styles.cloudOne} />
        <span className={styles.cloudTwo} />
        <span className={styles.contrail} />
      </div>
      <div className={styles.flightDeck}>
        <p className={styles.eyebrow}>Captain’s Log</p>
        <CaptainWorthATry
          className={styles.captain}
          decorative
          flightState={arrived ? "level" : "banked"}
          size="large"
        />
        <h1 className={styles.title} id="investigation-title">
          Looking for a little wiggle room.
        </h1>
        <p
          aria-atomic="true"
          aria-live="polite"
          className={styles.message}
          role="status"
        >
          {investigationMessages[messageIndex]}
        </p>
        <div
          aria-label={`Investigation message ${messageIndex + 1} of ${investigationMessages.length}`}
          aria-valuemax={investigationMessages.length}
          aria-valuemin={1}
          aria-valuenow={messageIndex + 1}
          className={styles.progress}
          role="progressbar"
        >
          {investigationMessages.map((message, index) => (
            <span
              aria-hidden="true"
              className={
                index <= messageIndex ? styles.progressActive : undefined
              }
              key={message}
            />
          ))}
        </div>
        <p className={styles.progressNote}>
          Captain’s messages are a fixed flight log, not technical processing
          stages.
        </p>
      </div>
    </section>
  );
}

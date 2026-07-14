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

export const INVESTIGATION_MESSAGE_DURATION_MS = 1_200;
export const INVESTIGATION_SEQUENCE_DURATION_MS =
  investigationMessages.length * INVESTIGATION_MESSAGE_DURATION_MS;

export const waitingMessages = [
  "Holding our course...",
  "Still with you...",
  "A little more paperwork turbulence...",
] as const;

export const WAITING_MESSAGE_DURATION_MS = 3_200;
export const stableWaitingMessage = "Still investigating.";
export const LONG_WAIT_MANOEUVRE_DELAY_MS = 5_000;
export const LONG_WAIT_MANOEUVRE_DURATION_MS = 2_600;

export function Investigation({ arrived = false }: { arrived?: boolean }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingIndex, setWaitingIndex] = useState(0);
  const [isManoeuvring, setIsManoeuvring] = useState(false);

  useEffect(() => {
    const messageTimers = investigationMessages
      .slice(1)
      .map((_, index) =>
        window.setTimeout(
          () => setMessageIndex(index + 1),
          (index + 1) * INVESTIGATION_MESSAGE_DURATION_MS,
        ),
      );
    let waitingTimers: number[] = [];
    const waitingTimer = window.setTimeout(() => {
      setIsWaiting(true);
      waitingTimers = [1, 2, 3].map((nextIndex) =>
        window.setTimeout(
          () => setWaitingIndex(nextIndex),
          nextIndex * WAITING_MESSAGE_DURATION_MS,
        ),
      );
    }, INVESTIGATION_SEQUENCE_DURATION_MS);
    const manoeuvreTimer = window.setTimeout(() => {
      setIsManoeuvring(true);
    }, INVESTIGATION_SEQUENCE_DURATION_MS + LONG_WAIT_MANOEUVRE_DELAY_MS);
    const manoeuvreEndTimer = window.setTimeout(
      () => {
        setIsManoeuvring(false);
      },
      INVESTIGATION_SEQUENCE_DURATION_MS +
        LONG_WAIT_MANOEUVRE_DELAY_MS +
        LONG_WAIT_MANOEUVRE_DURATION_MS,
    );

    return () => {
      messageTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(waitingTimer);
      window.clearTimeout(manoeuvreTimer);
      window.clearTimeout(manoeuvreEndTimer);
      waitingTimers.forEach((timer) => window.clearTimeout(timer));
    };
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
        <span className={styles.paperwork} />
      </div>
      <div className={styles.flightDeck}>
        <p className={styles.eyebrow}>Captain’s Log</p>
        <div
          className={`${styles.captainPath} ${isManoeuvring ? styles.manoeuvring : ""}`}
          data-manoeuvring={isManoeuvring}
        >
          <CaptainWorthATry
            className={styles.captain}
            decorative
            flightState={arrived ? "level" : "banked"}
            size="large"
          />
          <span aria-hidden="true" className={styles.noSign}>
            NO
          </span>
        </div>
        <h1 className={styles.title} id="investigation-title">
          Looking for a little wiggle room.
        </h1>
        <p
          aria-atomic="true"
          aria-live="polite"
          className={isWaiting ? styles.waitingMessage : styles.message}
          role="status"
        >
          {isWaiting
            ? (waitingMessages[waitingIndex] ?? stableWaitingMessage)
            : investigationMessages[messageIndex]}
        </p>
        <div
          aria-label={
            isWaiting
              ? "Captain's Log complete; analysis still pending"
              : `Investigation message ${messageIndex + 1} of ${investigationMessages.length}`
          }
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

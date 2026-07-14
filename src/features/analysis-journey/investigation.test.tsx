import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  INVESTIGATION_MESSAGE_DURATION_MS,
  Investigation,
  LONG_WAIT_MANOEUVRE_DELAY_MS,
  LONG_WAIT_MANOEUVRE_DURATION_MS,
  WAITING_MESSAGE_DURATION_MS,
  investigationMessages,
  stableWaitingMessage,
  waitingMessages,
} from "./investigation";

describe("Investigation", () => {
  afterEach(() => vi.useRealTimers());

  it("announces the fixed Captain's Log sequence in order", () => {
    vi.useFakeTimers();
    render(<Investigation />);

    expect(screen.getByRole("status")).toHaveTextContent(
      investigationMessages[0],
    );

    for (const message of investigationMessages.slice(1)) {
      act(() => vi.advanceTimersByTime(INVESTIGATION_MESSAGE_DURATION_MS));
      expect(screen.getByRole("status")).toHaveTextContent(message);
    }

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "5",
    );

    act(() => vi.advanceTimersByTime(INVESTIGATION_MESSAGE_DURATION_MS));
    expect(screen.getByRole("status")).toHaveTextContent(waitingMessages[0]);
    expect(screen.getByRole("progressbar")).toHaveAccessibleName(
      "Captain's Log complete; analysis still pending",
    );

    for (const message of waitingMessages.slice(1)) {
      act(() => vi.advanceTimersByTime(WAITING_MESSAGE_DURATION_MS));
      expect(screen.getByRole("status")).toHaveTextContent(message);
    }

    act(() => vi.advanceTimersByTime(WAITING_MESSAGE_DURATION_MS));
    expect(screen.getByRole("status")).toHaveTextContent(stableWaitingMessage);

    act(() => vi.advanceTimersByTime(WAITING_MESSAGE_DURATION_MS * 3));
    expect(screen.getByRole("status")).toHaveTextContent(stableWaitingMessage);
  });

  it("performs the decorative long-wait manoeuvre only once", () => {
    vi.useFakeTimers();
    const { container } = render(<Investigation />);
    const captainPath = container.querySelector("[data-manoeuvring]");
    const noSign = screen.getByText("NO");

    expect(captainPath).toHaveAttribute("data-manoeuvring", "false");
    expect(noSign).toHaveAttribute("aria-hidden", "true");

    act(() =>
      vi.advanceTimersByTime(
        investigationMessages.length * INVESTIGATION_MESSAGE_DURATION_MS +
          LONG_WAIT_MANOEUVRE_DELAY_MS,
      ),
    );
    expect(captainPath).toHaveAttribute("data-manoeuvring", "true");

    act(() => vi.advanceTimersByTime(LONG_WAIT_MANOEUVRE_DURATION_MS));
    expect(captainPath).toHaveAttribute("data-manoeuvring", "false");

    act(() => vi.advanceTimersByTime(LONG_WAIT_MANOEUVRE_DELAY_MS * 3));
    expect(captainPath).toHaveAttribute("data-manoeuvring", "false");
  });
});

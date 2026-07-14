import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Investigation, investigationMessages } from "./investigation";

describe("Investigation", () => {
  afterEach(() => vi.useRealTimers());

  it("announces the fixed Captain's Log sequence in order", () => {
    vi.useFakeTimers();
    render(<Investigation />);

    expect(screen.getByRole("status")).toHaveTextContent(
      investigationMessages[0],
    );

    for (const message of investigationMessages.slice(1)) {
      act(() => vi.advanceTimersByTime(750));
      expect(screen.getByRole("status")).toHaveTextContent(message);
    }

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "5",
    );
  });
});

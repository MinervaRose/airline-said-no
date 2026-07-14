import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RejectionInput } from "./rejection-input";

describe("RejectionInput", () => {
  it("shows the approved 4 MB upload limit", () => {
    render(<RejectionInput />);

    expect(
      screen.getByText("PDF, PNG, JPG or JPEG · 4 MB maximum"),
    ).toBeInTheDocument();
  });

  it("selects and removes one supported document", async () => {
    const user = userEvent.setup();
    render(<RejectionInput />);
    const input = screen.getByLabelText(/drop your rejection here/i);
    const file = new File(["rejection"], "airline-rejection.pdf", {
      type: "application/pdf",
    });

    await user.upload(input, file);

    expect(screen.getByText("airline-rejection.pdf")).toBeInTheDocument();
    expect(screen.getByText(/document ready/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /remove airline-rejection.pdf/i }),
    );

    expect(screen.getByText(/drop your rejection here/i)).toBeInTheDocument();
  });

  it("rejects an unsupported document", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<RejectionInput />);
    const input = screen.getByLabelText(/drop your rejection here/i);

    await user.upload(
      input,
      new File(["rejection"], "rejection.txt", { type: "text/plain" }),
    );

    expect(
      screen.getByText(
        "I’m afraid I haven’t learnt to read that chart just yet.",
      ),
    ).toBeInTheDocument();
  });

  it("rejects multiple dropped documents", () => {
    render(<RejectionInput />);
    const dropzone = screen
      .getByText(/drop your rejection here/i)
      .closest("label");

    fireEvent.drop(dropzone!, {
      dataTransfer: {
        files: [
          new File(["one"], "one.pdf", { type: "application/pdf" }),
          new File(["two"], "two.pdf", { type: "application/pdf" }),
        ],
      },
    });

    expect(
      screen.getByText("Choose one rejection document at a time."),
    ).toBeInTheDocument();
  });

  it("accepts one supported document by drag and drop", () => {
    render(<RejectionInput />);
    const dropzone = screen
      .getByText(/drop your rejection here/i)
      .closest("label");

    fireEvent.drop(dropzone!, {
      dataTransfer: {
        files: [
          new File(["rejection"], "dropped-rejection.png", {
            type: "image/png",
          }),
        ],
      },
    });

    expect(screen.getByText("dropped-rejection.png")).toBeInTheDocument();
    expect(screen.getByText(/document ready/i)).toBeInTheDocument();
  });

  it("clears file state when switching to pasted text", async () => {
    const user = userEvent.setup();
    render(<RejectionInput />);
    const input = screen.getByLabelText(/drop your rejection here/i);

    await user.upload(
      input,
      new File(["rejection"], "rejection.pdf", {
        type: "application/pdf",
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Paste rejection text" }),
    );

    expect(screen.queryByText("rejection.pdf")).not.toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /paste the airline’s rejection/i }),
    ).toHaveValue("");
  });

  it("shows and clears valid pasted-text state", async () => {
    const user = userEvent.setup();
    render(<RejectionInput />);
    await user.click(
      screen.getByRole("button", { name: "Paste rejection text" }),
    );
    const textArea = screen.getByRole("textbox", {
      name: /paste the airline’s rejection/i,
    });

    await user.type(textArea, "The airline rejected my request.");
    expect(screen.getByText("Text ready")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear text" }));
    expect(textArea).toHaveValue("");
    expect(screen.queryByText("Text ready")).not.toBeInTheDocument();
  });

  it("rejects empty pasted text on blur", async () => {
    const user = userEvent.setup();
    render(<RejectionInput />);
    await user.click(
      screen.getByRole("button", { name: "Paste rejection text" }),
    );
    const textArea = screen.getByRole("textbox", {
      name: /paste the airline’s rejection/i,
    });

    await user.click(textArea);
    await user.tab();

    expect(
      screen.getByText(
        "Looks like we lost that in the clouds. Let’s try another approach.",
      ),
    ).toBeInTheDocument();
    expect(textArea).toHaveAttribute("aria-invalid", "true");
  });

  it("keeps the file selector keyboard focusable", async () => {
    const user = userEvent.setup();
    render(<RejectionInput />);
    const input = screen.getByLabelText(/drop your rejection here/i);

    await user.tab();
    await user.tab();
    await user.tab();

    expect(input).toHaveFocus();
  });

  it("submits one normalized pasted-text input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RejectionInput onSubmit={onSubmit} />);
    await user.click(
      screen.getByRole("button", { name: "Paste rejection text" }),
    );
    await user.type(
      screen.getByRole("textbox", { name: /paste the airline’s rejection/i }),
      "  Rejected claim.  ",
    );
    await user.click(
      screen.getByRole("button", {
        name: /check if “no” really means “no”/i,
      }),
    );

    expect(onSubmit).toHaveBeenCalledWith({
      kind: "text",
      text: "Rejected claim.",
    });
  });

  it("supports the pasted-text submission journey using only the keyboard", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RejectionInput onSubmit={onSubmit} />);

    await user.tab();
    expect(
      screen.getByRole("button", { name: "Upload one rejection document" }),
    ).toHaveFocus();
    await user.tab();
    await user.keyboard("{Enter}");
    await user.tab();
    const textArea = screen.getByRole("textbox", {
      name: /paste the airline’s rejection/i,
    });
    expect(textArea).toHaveFocus();
    await user.type(textArea, "Synthetic rejection text.");
    await user.tab();
    await user.tab();
    expect(
      screen.getByRole("button", {
        name: /check if “no” really means “no”/i,
      }),
    ).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledWith({
      kind: "text",
      text: "Synthetic rejection text.",
    });
  });
});

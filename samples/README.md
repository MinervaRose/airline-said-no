# Sample files

This folder contains a small set of fictional documents you can use to try **Airline Said No** without needing to create your own case first.

Everything in these files has been invented for the project, including the airline, passenger names, flight numbers, dates, booking references, email addresses, and contact details. No real passenger data is included.

## What’s in the folder

| File | Format | What it helps demonstrate |
|---|---|---|
| `northstar-letter-01.png` | PNG | A relatively strong case based on a vague reference to operational reasons |
| `northstar-letter-02.png` | PNG | An uncertain case where extraordinary circumstances are mentioned without supporting evidence |
| `northstar-letter-03.pdf` | PDF | A weak case where the passenger appears to have arrived after boarding closed |
| `northstar-email-01.txt` | Text | A journey that falls outside the current EU261 scope |
| `northstar-letter-04.png` | PNG | A document containing conflicting travel dates that should be noticed before any recommendation is made |

## A note for reviewers

The samples are meant to show how the application behaves across several different situations, rather than force one exact answer.

Because GPT-5.6 may phrase things slightly differently from one run to another, the wording can vary. What matters is whether the application:

- extracts the important facts accurately;
- notices when information is missing or contradictory;
- distinguishes between stronger, weaker, uncertain, and out-of-scope cases;
- explains its reasoning in the order **Facts → Interpretation → Recommendation**;
- waits until the analysis is complete before offering an editable draft reply.

Uploaded documents are processed for the current session only and are not stored. The application also treats their contents as evidence, never as instructions.
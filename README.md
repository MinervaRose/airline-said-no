<p align="center">

<!-- TODO: Hero banner -->

<img src="docs/images/hero-banner.png" alt="Airline Said No">

</p>

<h1 align="center">✈️ Airline Said No</h1>

<p align="center">
An explainable second opinion for airline compensation refusals.
<br>
Built with <strong>Codex</strong> and <strong>GPT-5.6</strong> for OpenAI Build Week.
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--5.6-412991)
![Tests](https://img.shields.io/badge/Tests-78_Passing-success)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

# What is Airline Said No?

We've all been there.

You receive an email explaining that your compensation claim has been rejected. The explanation is often brief, sometimes vague, and it's not always clear whether the decision is justified or worth challenging.

**Airline Said No** doesn't promise compensation, and it doesn't replace legal advice.

Instead, it helps travellers understand what actually happened by reconstructing the facts, explaining the airline's reasoning, highlighting missing or contradictory information, and suggesting one realistic next step.

If appropriate, it can then draft a calm, editable reply that the traveller remains completely free to modify before sending.

Every analysis follows the same order:

1. Facts
2. Interpretation
3. Recommendation

---

# Gallery


| Landing page | Analysis | Draft reply |
|--------------|-----------|-------------|
| ![](docs/images/landing.png) | ![](docs/images/analysis.png) | ![](docs/images/draft.png) |

---

# 🎬 Demo Video

Watch a short demonstration of **Airline Said No** in action:

[![Watch the demo](docs/images/hero-banner.png)](https://youtu.be/RR64KEt8Miw)

▶️ **YouTube:** https://youtu.be/RR64KEt8Miw

---

# Features

- ✈️ Understand why an airline rejected a compensation request
- 📄 Analyse PDF, PNG, JPG/JPEG and pasted text
- 🧠 Grounded reasoning powered by GPT-5.6 structured outputs
- 🔍 Distinguish facts from interpretation
- ⚠️ Detect missing and contradictory evidence
- ✉️ Draft a professional, editable follow-up reply
- 🔒 Privacy-first architecture with request-scoped document processing

---

# Trying it yourself

## Requirements

- Node.js 22.x
- npm
- Your own OpenAI API key

Clone the repository, copy `.env.example` to `.env.local`, add your API key, then run:

```bash
npm install
npm run dev
```

The application will then be available at:

```text
http://localhost:3000
```

## Sample documents

A collection of fictional airline correspondence is included in the `samples/` folder.

These files are designed to exercise different reasoning paths and make it easy to try the application without creating your own test data.

Everything in the samples has been invented specifically for this project. No real passenger data is included.

---

# Environment variables

Environment variables are read through `src/config/env.ts`.

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ | Your OpenAI API key. Never exposed to the browser. |
| `OPENAI_MODEL` | Optional | Defaults to `gpt-5.6`. |

---

# Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build locally |
| `npm test` | Run the test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Strict TypeScript checking |
| `npm run format` | Format supported files |
| `npm run format:check` | Check formatting |
| `npm run check` | Run formatting, linting and type checking together |

---

# Project structure

```
src/
├── app/                 App Router routes
├── components/
│   ├── mascot/          Captain WorthATry
│   └── ui/              Reusable UI primitives
├── config/              Typed configuration
├── features/            Product features
└── styles/              Semantic design tokens

samples/                 Fictional investigation files
docs/                    README assets
```

---

# Architecture

Some of the architectural choices made during development include:

- Server Components by default
- OpenAI Responses API
- Structured Outputs with Zod validation
- Request-scoped document processing
- No document persistence
- `store: false` on OpenAI requests
- Strict TypeScript throughout
- Comprehensive automated test suite
- Accessibility-first interface with keyboard support and reduced-motion handling

---

# Built with Codex

One of the goals of this project was to explore what it feels like to build a complete product collaboratively with **Codex**.

Rather than treating Codex as a code generator, I used it as an engineering partner throughout the project. It helped scaffold the application, implement features, write tests, refine prompts, improve accessibility, polish the user experience, and continually review the codebase as it evolved.

GPT-5.6 powers the application's analysis and draft-generation capabilities through the OpenAI Responses API.

---

# Deployment

The application has been prepared for deployment on Vercel, although it was intentionally left undeployed for this submission because running the application requires an OpenAI API key.

Everything needed to deploy is already present in the repository should you wish to do so.

---

# Acknowledgements

Created for **OpenAI Build Week** using **Codex** and **GPT-5.6**.

Special thanks to Captain WorthATry for flying through an alarming amount of paperwork.
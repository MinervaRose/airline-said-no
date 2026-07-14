import { CaptainWorthATry } from "@/components/mascot";
import { Card } from "@/components/ui/card";
import { StatusIndicator } from "@/components/ui/status-indicator";
import type { AnalysisResult } from "@/features/analysis";
import { DraftReply } from "@/features/draft-reply";
import styles from "./analysis-results.module.css";

const strengthTone = {
  Strong: "success",
  Uncertain: "warning",
  Weak: "neutral",
} as const;

export function AnalysisResults({ result }: { result: AnalysisResult }) {
  return (
    <article className={styles.results}>
      <header className={styles.hero}>
        <div>
          <p className={styles.logLabel}>Captain’s Log</p>
          <h1>I’ve flown through your paperwork.</h1>
          <p>Here’s what caught my eye.</p>
        </div>
        <CaptainWorthATry decorative flightState="level" size="medium" />
      </header>

      <aside className={styles.scope} aria-label="EU261 scope assessment">
        <strong>
          {result.scope.status === "within_eu261"
            ? "This looks within EU261 scope."
            : result.scope.status === "outside_eu261"
              ? "This appears to be outside our EU261 scope."
              : "EU261 scope is not clear yet."}
        </strong>
        <span>{result.scope.explanation}</span>
      </aside>

      <section aria-labelledby="facts-title" className={styles.section}>
        <div className={styles.sectionNumber}>01 · Facts</div>
        <h2 id="facts-title">What happened?</h2>
        <div className={styles.factGrid}>
          {result.facts.map((fact) => (
            <Card
              key={`${fact.label}-${fact.value}`}
              padding="compact"
              variant="outlined"
            >
              <p className={styles.itemLabel}>{fact.label}</p>
              <p className={styles.itemValue}>{fact.value}</p>
              <p className={styles.basis}>
                <span>
                  {fact.certainty === "confirmed" ? "Confirmed" : "Uncertain"}
                </span>
                {fact.basis}
              </p>
            </Card>
          ))}
        </div>
        {result.timeline.length > 0 ? (
          <div className={styles.subsection}>
            <h3>Timeline</h3>
            <ol className={styles.timeline}>
              {result.timeline.map((event, index) => (
                <li key={`${event.date ?? "unknown"}-${event.event}-${index}`}>
                  <span className={styles.timelineDate}>
                    {event.date ?? "Date not provided"}
                  </span>
                  <span>{event.event}</span>
                  {event.certainty === "uncertain" ? <em>Uncertain</em> : null}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
        {result.missingInformation.length > 0 ? (
          <div className={styles.missing}>
            <h3>What’s still missing?</h3>
            <p>These details could materially change the assessment.</p>
            <ul>
              {result.missingInformation.map((missing) => (
                <li key={missing.item}>
                  <strong>{missing.item}</strong>
                  <span>{missing.whyItMatters}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section
        aria-labelledby="interpretation-title"
        className={styles.section}
      >
        <div className={styles.sectionNumber}>02 · Interpretation</div>
        <div className={styles.interpretationGrid}>
          <div>
            <h2 id="interpretation-title">Why did they say no?</h2>
            <p className={styles.lead}>{result.refusalReason.summary}</p>
            {result.refusalReason.statedReason ? (
              <p className={styles.statedReason}>
                <strong>Reason stated by the airline</strong>
                {result.refusalReason.statedReason}
              </p>
            ) : null}
          </div>
          <Card className={styles.take} padding="comfortable" variant="accent">
            <div className={styles.takeHeader}>
              <h3>Our take</h3>
              <StatusIndicator tone={strengthTone[result.caseStrength]}>
                Case strength: {result.caseStrength}
              </StatusIndicator>
            </div>
            <p>{result.interpretation.summary}</p>
            {result.interpretation.caveats.length > 0 ? (
              <ul>
                {result.interpretation.caveats.map((caveat) => (
                  <li key={caveat}>{caveat}</li>
                ))}
              </ul>
            ) : null}
          </Card>
        </div>
        <div className={styles.evidenceGrid}>
          <div>
            <h3>Evidence present</h3>
            {result.evidence.available.length > 0 ? (
              <ul className={styles.evidenceList}>
                {result.evidence.available.map((item) => (
                  <li key={item.item}>
                    <strong>{item.item}</strong>
                    <span>{item.relevance}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No supporting evidence was identifiable in this submission.</p>
            )}
          </div>
          <div>
            <h3>What could help?</h3>
            {result.evidence.couldHelp.length > 0 ? (
              <ul className={styles.evidenceList}>
                {result.evidence.couldHelp.map((item) => (
                  <li key={item.item}>
                    <strong>{item.item}</strong>
                    <span>{item.relevance}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No additional evidence was identified as essential.</p>
            )}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="recommendation-title"
        className={styles.recommendation}
      >
        <div className={styles.sectionNumber}>03 · Recommendation</div>
        <h2 id="recommendation-title">Best next move</h2>
        <p className={styles.recommendationText}>
          {result.recommendedNextMove}
        </p>
        <div className={styles.rationale}>
          <strong>Why this move?</strong>
          <p>{result.rationale}</p>
        </div>
        <DraftReply analysis={result} />
      </section>
      <p className={styles.disclaimer}>
        Airline Said No provides information and drafting assistance. It is not
        legal advice.
      </p>
    </article>
  );
}

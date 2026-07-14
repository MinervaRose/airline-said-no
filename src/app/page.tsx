import { CaptainWorthATry } from "@/components/mascot";
import { RejectionInput } from "@/features/rejection-input";

import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <span aria-hidden="true" className={styles.routeLine} />
      <div className={styles.shell}>
        <header className={styles.wordmark}>
          <span aria-hidden="true" className={styles.wordmarkMark} />
          Airline Said No.
        </header>

        <section className={styles.hero}>
          <div className={styles.copy}>
            <p className={styles.bearing}>An explainable second opinion</p>
            <h1 className={styles.headline}>
              <span>Airline Said No.</span>
              <span className={styles.headlineAccent}>Let’s get a yes.</span>
              <span className={styles.headlineAside}>…or at least try.</span>
            </h1>
            <p className={styles.intro}>
              Upload the airline’s rejection or paste the text. We’ll help you
              understand whether “No” is truly final.
            </p>
            <div className={styles.captainDock}>
              <CaptainWorthATry
                className={styles.captain}
                decorative
                size="large"
              />
              <p className={styles.motto}>Worth a try.</p>
            </div>
          </div>

          <div className={styles.inputColumn}>
            <RejectionInput />
          </div>
        </section>

        <footer className={styles.footer}>
          Airline Said No provides information and drafting assistance. It is
          not legal advice.
        </footer>
      </div>
    </main>
  );
}

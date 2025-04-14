import type { CSSProperties } from "react";
import styles from "./Spinner.module.scss";

export const Spinner = ({ size = 20 }: { size?: number }) => {
  return (
    <div
      className={styles.wrapper}
      style={{ "--spinner-size": `${size}px` } as CSSProperties}
    >
      <div className={styles.spinner}>
        {[...Array(12)].map((_, index) => (
          <div key={index} className={styles.bar} />
        ))}
      </div>
    </div>
  );
};

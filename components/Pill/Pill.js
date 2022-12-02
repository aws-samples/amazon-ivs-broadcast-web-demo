import styles from './Pill.module.css';

export default function Pill({ type, children }) {
  let pillClass = `${styles.pill} ${styles.pillBase}`;

  switch (type) {
    case 'primary':
      pillClass = `${styles.pill} ${styles.pillPrimary}`;
      break;
    case 'secondary':
      pillClass = `${styles.pill} ${styles.pillSecondary}`;
      break;
    case 'destruct':
      pillClass = `${styles.pill} ${styles.pillDestructive}`;
      break;
    case 'positive':
      pillClass = `${styles.pill} ${styles.pillPositive}`;
      break;
    default:
      pillClass = `${styles.pill} ${styles.pillBase}`;
      break;
  }

  return <div className={pillClass}>{children}</div>;
}

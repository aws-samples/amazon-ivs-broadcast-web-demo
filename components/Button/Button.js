import styles from './Button.module.css';
import Spinner from '../Spinner';

export default function Button({
  type,
  style,
  fullWidth,
  loading,
  children,
  ...buttonProps
}) {
  let typeClass;
  switch (type) {
    case 'primary':
      typeClass = `${styles.button} ${styles.buttonPrimary}`;
      break;
    case 'secondary':
      typeClass = `${styles.button} ${styles.buttonSecondary}`;
      break;
    case 'bordered':
      typeClass = `${styles.button} ${styles.buttonBordered}`;
      break;
    case 'destruct':
      typeClass = `${styles.button} ${styles.buttonDestruct}`;
      break;
    case 'confirm':
      typeClass = `${styles.button} ${styles.buttonConfirm}`;
      break;
    default:
      typeClass = styles.button;
      break;
  }

  let styleClass;
  switch (style) {
    case 'round':
      styleClass = ` ${styles.buttonRounded}`;
      break;
    case 'rounded':
      styleClass = ` ${styles.buttonRadiusLg}`;
      break;
    case 'roundedText':
      styleClass = ` ${styles.buttonRoundedText}`;
      break;
    case 'sharp':
      styleClass = '';
      break;
    default:
      styleClass = ` ${styles.buttonRadius}`;
      break;
  }

  let widthClass;
  switch (fullWidth) {
    case true:
      widthClass = ` ${styles.buttonFullWidth}`;
      break;
    case 'responsive':
      widthClass = ` ${styles.responsiveFullWidth}`;
      break;
    default:
      widthClass = '';
      break;
  }

  return (
    <button
      className={`${typeClass}${styleClass}${widthClass}`}
      {...buttonProps}
    >
      <span className={loading ? styles.invisible : styles.visible}>
        {children}
      </span>
      <span
        className={
          loading
            ? `${styles.visible} ${styles.spinner}`
            : `${styles.invisible} ${styles.spinner}`
        }
      >
        <Spinner />
      </span>
    </button>
  );
}

import styles from "./LinkButton.module.css";

export default function LinkButton({
  external,
  type,
  style,
  children,
  ...linkButtonProps
}) {
  
  let linkProps = external
    ? {
        rel: "noreferrer",
        target: "_blank",
      }
    : {};

  let typeClass = styles.button;
  switch (type) {
    case "primary":
      typeClass = `${styles.button} ${styles.buttonPrimary}`;
      break;
    case "secondary":
      typeClass = `${styles.button} ${styles.buttonSecondary}`;
      break;
    case "bordered":
      typeClass = `${styles.button} ${styles.buttonBordered}`;
      break;
    case "destruct":
      typeClass = `${styles.button} ${styles.buttonDestruct}`;
      break;
    case "confirm":
      typeClass = `${styles.button} ${styles.buttonConfirm}`;
      break;
    default:
      break;
  }

  let styleClass = ` ${styles.buttonRadius}`;
  switch (style) {
    case "round":
      styleClass = ` ${styles.buttonRounded}`;
      break;
    case "rounded":
      styleClass = ` ${styles.buttonRadiusLg}`;
      break;
    case "sharp":
      styleClass = "";
      break;
    default:
      break;
  }

  return (
    <a className={`${typeClass}${styleClass}`} {...linkButtonProps}>
      {children}
    </a>
  );
}

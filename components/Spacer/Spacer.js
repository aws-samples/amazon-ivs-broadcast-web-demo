import styles from "./Spacer.module.css"

export default function Spacer({ size }) {
  var sizeClass;
  switch (size) {
    case "sm":
      sizeClass = styles.spacerSm;
      break;
    case "md":
      sizeClass = styles.spacerMd;
      break;
    case "lg":
      sizeClass = styles.spacerLg;
      break;  
    case "xl":
      sizeClass = styles.spacerXl;
      break;  
    default:
      sizeClass = styles.spacerBase;
      break;
  }
  return (
    <div className={`${styles.spacer} ${sizeClass}`}></div>
  )
}
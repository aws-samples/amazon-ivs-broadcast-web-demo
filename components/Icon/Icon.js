import styles from "./Icon.module.css";
import { useEffect, useState } from "react";

export default function Icon({ type, size, children }) {
  const [colorClass, setColorClass] = useState(styles.iconColorCurrent);
  const [sizeClass, setSizeClass] = useState(styles.iconSizeBase);

  useEffect(() => {
    switch (type) {
      case "base":
        setColorClass(styles.iconColorBase)
        break;
      case "inverted":
        setColorClass(styles.iconColorInverted)
        break;
      case "success":
        setColorClass(styles.iconColorSuccess)
        break;
      case "error":
        setColorClass(styles.iconColorError)
        break;
      default:
        setColorClass(styles.iconColorCurrent)
        break;
    }
  }, [type])

  useEffect(() => {
    switch (size) {
      case "sm":
        setSizeClass(styles.iconSizeSm);
        break;
      case "md":
        setSizeClass(styles.iconSizeMd);
        break;
      case "lg":
        setSizeClass(styles.iconSizeLg);
        break;  
      case "xl":
        setSizeClass(styles.iconSizeXl);
        break;  
      default:
        setSizeClass(styles.iconSizeBase);
        break;
    }
  }, [size])

  return (
    <span className={`${styles.icon} ${colorClass} ${sizeClass}`}>
      {children}
    </span>
  );
}

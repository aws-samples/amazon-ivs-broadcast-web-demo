import { useState } from "react"
import styles from "./Tooltip.module.css"

export default function Tooltip({content, vAlign, hAlign, persist, hideAfter, children}) {
  const [active, setActive] = useState(false);
  const [timer, setTimer] = useState(null);

  const showTip = () => {
    if (persist) {
      setActive(true);
    } else {
      setActive(true);
      const timer = setTimeout(() => {
        setActive(false);
      }, hideAfter || 4000);
      setTimer(timer);
    }
  }

  const hideTip = () => {
    if (timer) { 
      clearInterval(timer);
      setTimer(null);
    }
    setActive(false);
  }

  var tipClass;
  switch (vAlign) {
    case "bottom":
      tipClass = styles.bottom;
      break;
    default:
      tipClass = styles.top;
      break;
  }
  tipClass += " ";
  switch (hAlign) {
    case "left":
      tipClass += styles.left;
      break;
    case "right":
      tipClass += styles.right;
      break;
    default:
      tipClass += styles.center;
      break;
  }
  return (
    <div className={styles.wrapper} onMouseEnter={showTip} onMouseLeave={hideTip}>
      {children}
      {active && (
        <div className={`${styles.tooltip} ${tipClass}`}>
          {content}
        </div>
      )}
    </div>
  )
}
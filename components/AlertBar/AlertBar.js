import { useEffect, useState } from "react";
import Button from "../Button";
import Icon from "../Icon";
import styles from "./AlertBar.module.css";

export default function AlertBar({ show, message, handleClose }) {
  const [visible, setVisible] = useState(show);
  const [alertContent, setAlertContent] = useState(show);

  const handleAlertClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      setAlertContent(
        <div className={styles.wrapper}>
          <div className={styles.layout}>
            <div className={styles.fixedContent}>
              <Icon type="inverted">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                  <path d="M12 12.5ZM2.725 21q-.575 0-.85-.5t0-1l9.25-16Q11.4 3 12 3t.875.5l9.25 16q.275.5 0 1t-.85.5ZM12 10q-.425 0-.712.287Q11 10.575 11 11v3q0 .425.288.712.287.288.712.288t.713-.288Q13 14.425 13 14v-3q0-.425-.287-.713Q12.425 10 12 10Zm0 8q.425 0 .713-.288Q13 17.425 13 17t-.287-.712Q12.425 16 12 16t-.712.288Q11 16.575 11 17t.288.712Q11.575 18 12 18Zm-7.55 1h15.1L12 6Z" />
                </svg>
              </Icon>
            </div>
            <div className={styles.content}>{message}</div>
            <div className={styles.fixedContent}>
              <Button type="bordered" onClick={handleAlertClose}>
                <Icon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    width="24"
                  >
                    <path d="m12 13.4-4.9 4.9q-.275.275-.7.275-.425 0-.7-.275-.275-.275-.275-.7 0-.425.275-.7l4.9-4.9-4.9-4.9q-.275-.275-.275-.7 0-.425.275-.7.275-.275.7-.275.425 0 .7.275l4.9 4.9 4.9-4.9q.275-.275.7-.275.425 0 .7.275.275.275.275.7 0 .425-.275.7L13.4 12l4.9 4.9q.275.275.275.7 0 .425-.275.7-.275.275-.7.275-.425 0-.7-.275Z" />
                  </svg>
                </Icon>
              </Button>
            </div>
          </div>
        </div>
      );
    } else {
      setAlertContent(<></>);
    }
  }, [visible]);

  return alertContent;
}

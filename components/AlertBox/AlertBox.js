import ReactDOM from 'react-dom';
import Button from '../Button';
import Icon from '../Icon';
import styles from './AlertBox.module.css';

export default function AlertBox({ type, show, onShow, onClose, children }) {
  // Nextjs browser env check
  if (typeof window === 'undefined') {
    return <></>;
  }

  // Return if the alert is hidden
  if (!show) {
    return <></>;
  }

  // Call onShow
  if (onShow) onShow();

  let alertBoxStyle = `${styles.alertWrapper}`;
  let alertBoxHeader = <></>;

  switch (type) {
    case 'error':
      // TODO: Add more alertbox styles
      alertBoxStyle = `${styles.alertWrapper} ${styles.error}`;
      alertBoxHeader = (
        <div className={styles.header}>
          <Icon type='error'>
            <svg xmlns='http://www.w3.org/2000/svg' height='24' width='24'>
              <path d='M12 13q.425 0 .713-.288Q13 12.425 13 12V7.975q0-.425-.287-.7Q12.425 7 12 7t-.712.287Q11 7.575 11 8v4.025q0 .425.288.7.287.275.712.275Zm0 4q.425 0 .713-.288Q13 16.425 13 16t-.287-.713Q12.425 15 12 15t-.712.287Q11 15.575 11 16t.288.712Q11.575 17 12 17Zm0 5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-10Zm0 8q3.325 0 5.663-2.337Q20 15.325 20 12t-2.337-5.663Q15.325 4 12 4T6.338 6.337Q4 8.675 4 12t2.338 5.663Q8.675 20 12 20Z' />
            </svg>
          </Icon>
          <span>Error</span>
        </div>
      );
      break;
    default:
      break;
  }

  // Set Content
  const content = (
    <div className={alertBoxStyle}>
      {alertBoxHeader}
      <div className={styles.alert}>{children}</div>
      <Button fullWidth={true} type='base' onClick={onClose}>
        Dismiss
      </Button>
    </div>
  );

  // Render Portal
  return ReactDOM.createPortal(
    content,
    document.getElementById('alert-container')
  );
}

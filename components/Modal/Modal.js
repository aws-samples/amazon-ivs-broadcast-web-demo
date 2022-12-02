import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

export default function Modal({ type, show, onShow, onClose, children }) {
  // Nextjs browser env check
  if (typeof window === 'undefined') {
    return <></>;
  }

  // Return if the modal is hidden
  if (!show) {
    return <></>;
  }

  // Call onShow
  if (onShow) onShow();

  let modalStyle = `${styles.modal}`;

  switch (type) {
    case 'full':
      modalStyle = `${styles.modal} ${styles.modalFull}`;
      break;
    default:
      break;
  }

  // When a modal is mounted, listen for keypresses on the window object.
  useEffect(() => {
    const closeModal = (e) => {
      if (e.key === 'Escape') {
        onClose(e);
      }
    };
    window.addEventListener('keydown', closeModal);
    return () => {
      window.removeEventListener('keydown', closeModal);
    };
  }, []);

  // Set Content
  const content = (
    <div className={styles.modalWrapper}>
      <div className={styles.modalBackground} onClick={onClose}></div>
      <div className={modalStyle}>{children}</div>
    </div>
  );

  // Render Portal
  return ReactDOM.createPortal(
    content,
    document.getElementById('modal-container')
  );
}

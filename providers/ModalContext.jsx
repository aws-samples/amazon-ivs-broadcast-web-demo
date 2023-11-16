import useModal from '@/hooks/useModal';
import { createContext, useRef, useState } from 'react';

const ModalContext = createContext({
  modalActive: false,
  toggleModal: undefined,
  modalContent: <></>,
});

function ModalProvider({ children }) {
  const [modalActive, toggleModal] = useModal();
  const [modalContent, setModalContent] = useState();
  const [modalProps, setModalProps] = useState();

  return (
    <ModalContext.Provider
      value={{
        modalActive,
        toggleModal,
        modalProps,
        setModalProps,
        modalContent,
        setModalContent,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export default ModalProvider;
export { ModalContext };

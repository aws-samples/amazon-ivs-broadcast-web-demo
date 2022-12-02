import { useState } from 'react';

const useModal = () => {
  const [modalActive, setModalActive] = useState(false);

  function toggleModal() {
    setModalActive(!modalActive);
  }

  return [
    modalActive,
    toggleModal,
  ]
};

export default useModal;
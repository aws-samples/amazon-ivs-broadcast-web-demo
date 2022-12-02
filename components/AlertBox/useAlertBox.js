import { useState } from 'react';

const useAlertBox = () => {
  const [alertBoxActive, setAlertBoxActive] = useState(false);

  function toggleAlertBox() {
    setAlertBoxActive(!alertBoxActive);
  }

  return [
    alertBoxActive,
    toggleAlertBox,
  ]
};

export default useAlertBox;
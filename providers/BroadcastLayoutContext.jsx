import useBroadcastLayout from '@/hooks/useBroadcastLayout';
import { createContext } from 'react';

const BroadcastLayoutContext = createContext({
  layersRef: undefined,
  camActive: undefined,
  setCamActive: undefined,
  screenShareActive: undefined,
  toggleScreenSharing: undefined,
  toggleCamVisiblity: undefined,
  showScreenShare: undefined,
  showFullScreenCam: undefined,
  removeAllLayers: undefined,
});

function BroadcastLayoutProvider({ children }) {
  const {
    layersRef,
    camActive,
    setCamActive,
    screenShareActive,
    toggleScreenSharing,
    toggleCamVisiblity,
    showScreenShare,
    showFullScreenCam,
    refreshCurrentScene,
    removeAllLayers,
  } = useBroadcastLayout();

  return (
    <BroadcastLayoutContext.Provider
      value={{
        layersRef,
        camActive,
        setCamActive,
        screenShareActive,
        toggleScreenSharing,
        toggleCamVisiblity,
        showScreenShare,
        showFullScreenCam,
        refreshCurrentScene,
        removeAllLayers,
      }}
    >
      {children}
    </BroadcastLayoutContext.Provider>
  );
}

export default BroadcastLayoutProvider;
export { BroadcastLayoutContext };

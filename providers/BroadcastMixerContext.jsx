import useBroadcastMixer from '@/hooks/useBroadcastMixer';
import { createContext } from 'react';

const BroadcastMixerContext = createContext({
  micMuted: undefined,
  setMicMuted: undefined,
  addMixerDevice: undefined,
  addMixerDevices: undefined,
  refreshMixer: undefined,
  removeMixerDevice: undefined,
  removeOldDevices: undefined,
  getMixerDevice: undefined,
  mixerDevicesRef: undefined,
  toggleMute: undefined,
});

function BroadcastMixerProvider({ children }) {
  const {
    micMuted,
    setMicMuted,
    addMixerDevice,
    addMixerDevices,
    refreshMixer,
    removeMixerDevice,
    removeOldDevices,
    getMixerDevice,
    mixerDevicesRef,
    toggleMute,
  } = useBroadcastMixer();

  return (
    <BroadcastMixerContext.Provider
      value={{
        micMuted,
        setMicMuted,
        addMixerDevice,
        addMixerDevices,
        removeMixerDevice,
        removeOldDevices,
        refreshMixer,
        getMixerDevice,
        mixerDevicesRef,
        toggleMute,
      }}
    >
      {children}
    </BroadcastMixerContext.Provider>
  );
}

export default BroadcastMixerProvider;
export { BroadcastMixerContext };

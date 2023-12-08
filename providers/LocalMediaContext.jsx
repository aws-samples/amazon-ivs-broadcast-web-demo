import { createContext } from 'react';
import useLocalMedia from '@/hooks/useLocalMedia.js';

const LocalMediaContext = createContext({
  permissions: undefined,
  localVideoMounted: undefined,
  localAudioMounted: undefined,
  audioDevices: undefined,
  videoDevices: undefined,
  localAudioStreamRef: undefined,
  localVideoStreamRef: undefined,
  localAudioDeviceIdRef: undefined,
  localVideoDeviceIdRef: undefined,
  localAudioDeviceId: undefined,
  localVideoDeviceId: undefined,
  videoElemRef: undefined,
  canvasElemRef: undefined,
  localScreenShareStreamRef: undefined,
  updateLocalAudio: undefined,
  updateLocalVideo: undefined,
  setInitialDevices: undefined,
  refreshDevices: undefined,
  setAudioDevices: undefined,
  setVideoDevices: undefined,
  startScreenShare: undefined,
  stopScreenShare: undefined,
});

function LocalMediaProvider({ children }) {
  const {
    permissions,
    localVideoMounted,
    localAudioMounted,
    audioDevices,
    videoDevices,
    localAudioStreamRef,
    localVideoStreamRef,
    localAudioDeviceIdRef,
    localVideoDeviceIdRef,
    localAudioDeviceId,
    localVideoDeviceId,
    videoElemRef,
    canvasElemRef,
    localScreenShareStreamRef,
    updateLocalAudio,
    updateLocalVideo,
    setInitialDevices,
    cleanUpDevices,
    refreshDevices,
    setAudioDevices,
    setVideoDevices,
    startScreenShare,
    stopScreenShare,
  } = useLocalMedia();

  const state = {
    permissions,
    localVideoMounted,
    localAudioMounted,
    audioDevices,
    videoDevices,
    localAudioStreamRef,
    localVideoStreamRef,
    localAudioDeviceIdRef,
    localVideoDeviceIdRef,
    localAudioDeviceId,
    localVideoDeviceId,
    videoElemRef,
    canvasElemRef,
    localScreenShareStreamRef,
    updateLocalAudio,
    updateLocalVideo,
    setInitialDevices,
    cleanUpDevices,
    refreshDevices,
    setAudioDevices,
    setVideoDevices,
    startScreenShare,
    stopScreenShare,
  };

  return (
    <LocalMediaContext.Provider value={state}>
      {children}
    </LocalMediaContext.Provider>
  );
}

export default LocalMediaProvider;
export { LocalMediaContext };

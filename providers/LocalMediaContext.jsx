import { createContext, useMemo } from 'react';
import useLocalMedia from '@/hooks/useLocalMedia.js';

const LocalMediaContext = createContext({
  permissions: undefined,
  localVideoMounted: undefined,
  localAudioMounted: undefined,
  audioDevices: undefined,
  videoDevices: undefined,
  localAudioStreamRef: undefined,
  localVideoStreamRef: undefined,
  localAudioDeviceId: undefined,
  localVideoDeviceId: undefined,
  videoElemRef: undefined,
  canvasElemRef: undefined,
  refreshSceneRef: undefined,
  localScreenShareStreamRef: undefined,
  enableCanvasCamera: undefined,
  setEnableCanvasCamera: undefined,
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
    localAudioDeviceId,
    localVideoDeviceId,
    videoElemRef,
    canvasElemRef,
    refreshSceneRef,
    localScreenShareStreamRef,
    enableCanvasCamera,
    setEnableCanvasCamera,
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

  const state = useMemo(() => {
    return {
      permissions,
      localVideoMounted,
      localAudioMounted,
      audioDevices,
      videoDevices,
      localAudioStreamRef,
      localVideoStreamRef,
      localAudioDeviceId,
      localVideoDeviceId,
      videoElemRef,
      canvasElemRef,
      refreshSceneRef,
      localScreenShareStreamRef,
      enableCanvasCamera,
      setEnableCanvasCamera,
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
  }, [
    permissions,
    localVideoMounted,
    localAudioMounted,
    audioDevices,
    videoDevices,
    localAudioStreamRef,
    localVideoStreamRef,
    localAudioDeviceId,
    localVideoDeviceId,
    videoElemRef,
    canvasElemRef,
    refreshSceneRef,
    localScreenShareStreamRef,
    enableCanvasCamera,
    updateLocalAudio,
    updateLocalVideo,
    setInitialDevices,
    cleanUpDevices,
    refreshDevices,
    setAudioDevices,
    setVideoDevices,
    startScreenShare,
    stopScreenShare,
  ]);

  return (
    <LocalMediaContext.Provider value={state}>
      {children}
    </LocalMediaContext.Provider>
  );
}

export default LocalMediaProvider;
export { LocalMediaContext };

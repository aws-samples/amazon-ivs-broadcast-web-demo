import { useCallback, useContext, useRef, useState } from 'react';
import {
  getCameraStream,
  getMicrophoneStream,
  getAvailableDevices,
  getScreenshareStream,
  getIdealDevice,
} from '@/utils/LocalMedia';
import useLocalStorage from '@/hooks/useLocalStorage';
import { UserSettingsContext } from '@/providers/UserSettingsContext';

function useLocalMedia() {
  const { configRef, orientation } = useContext(UserSettingsContext);

  const localAudioStreamRef = useRef();
  const localVideoStreamRef = useRef();

  const videoElemRef = useRef();
  const canvasElemRef = useRef();

  const [localVideoMounted, setLocalVideoMounted] = useState(false);
  const [localAudioMounted, setLocalAudioMounted] = useState(false);
  const localVideoDeviceIdRef = useRef();
  const localAudioDeviceIdRef = useRef();
  // const [localVideoDeviceId, setLocalVideoDeviceId] = useState(false);
  // const [localAudioDeviceId, setLocalAudioDeviceId] = useState(false);
  const localScreenShareRef = useRef();
  // const audioDevicesRef = useRef([]);
  // const videoDevicesRef = useRef([]);

  const cameraCanvasRef = useRef();
  const cameraVideoRef = useRef();

  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [permissions, setPermissions] = useState(false);

  const [savedAudioDeviceId, setSavedAudioDeviceId] = useLocalStorage(
    'savedAudioDeviceId',
    undefined
  );
  const [savedVideoDeviceId, setSavedVideoDeviceId] = useLocalStorage(
    'savedVideoDeviceId',
    undefined
  );

  const setInitialDevices = async () => {
    const {
      videoDevices: _videoDevices,
      audioDevices: _audioDevices,
      permissions: _permissions,
    } = await refreshDevices();

    let audioDeviceId = getIdealDevice(savedAudioDeviceId, _audioDevices);
    let videoDeviceId = getIdealDevice(savedVideoDeviceId, _videoDevices);

    const audioStream = await updateLocalAudio(audioDeviceId);
    const videoStream = await updateLocalVideo(videoDeviceId);

    return { audioDeviceId, audioStream, videoDeviceId, videoStream };
  };

  const refreshDevices = async () => {
    const { videoDevices, audioDevices, permissions } =
      await getAvailableDevices({ savedAudioDeviceId, savedVideoDeviceId });

    const formattedAudioDevices = audioDevices.map((device) => {
      return { label: device.label, value: device.deviceId };
    });
    const formattedVideoDevices = videoDevices.map((device) => {
      return { label: device.label, value: device.deviceId };
    });

    setAudioDevices(formattedAudioDevices);
    setVideoDevices(formattedVideoDevices);

    setPermissions(permissions);

    return {
      audioDevices: formattedAudioDevices,
      videoDevices: formattedVideoDevices,
      permissions,
    };
  };

  const updateLocalAudio = async (deviceId) => {
    try {
      localAudioStreamRef.current &&
        localAudioStreamRef.current.getTracks()[0].stop();
    } catch (err) {
      console.error(err);
    }
    const audioStream = await setLocalAudioFromId(deviceId);
    localAudioDeviceIdRef.current = deviceId;
    setSavedAudioDeviceId(deviceId);
    return audioStream;
  };

  const updateLocalVideo = async (deviceId) => {
    try {
      localVideoStreamRef.current &&
        localVideoStreamRef.current.getTracks()[0].stop();
    } catch (err) {
      console.error(err);
    }
    const videoStream = await setLocalVideoFromId(deviceId);
    localVideoDeviceIdRef.current = deviceId;
    setSavedVideoDeviceId(deviceId);

    return videoStream;
  };

  const startScreenShare = async () => {
    let screenShareStream = undefined;
    try {
      screenShareStream = await getScreenshareStream();
      localScreenShareRef.current = screenShareStream;
    } catch (err) {
      console.err(err);
    }
    return screenShareStream;
  };

  const stopScreenShare = async () => {
    if (localScreenShareRef.current?.getTracks()) {
      for (const track of localScreenShareRef.current.getTracks()) {
        track.stop();
      }
    }
  };

  const setLocalVideoFromId = async (deviceId) => {
    const _config = configRef.current
      ? configRef.current
      : { width: undefined, height: undefined };
    const { width = 1280, height = 720 } = _config;
    const videoStream = await getCameraStream({
      deviceId,
      width,
      height,
      facingMode: 'environment',
      frameRate: 30,
      aspectRatio: orientation === 'LANDSCAPE' ? 16 / 9 : 9 / 16,
    });
    localVideoStreamRef.current = videoStream;
    if (!localVideoMounted) setLocalVideoMounted(true);
    return videoStream;
  };

  const setLocalAudioFromId = async (deviceId) => {
    const audioStream = await getMicrophoneStream(deviceId);
    localAudioStreamRef.current = audioStream;
    if (!localAudioMounted) setLocalAudioMounted(true);
    return audioStream;
  };

  return {
    permissions,
    localVideoMounted,
    localAudioMounted,
    audioDevices,
    videoDevices,
    localAudioStreamRef,
    localVideoStreamRef,
    localAudioDeviceIdRef,
    localVideoDeviceIdRef,
    localAudioDeviceId: savedAudioDeviceId,
    localVideoDeviceId: savedVideoDeviceId,
    videoElemRef,
    canvasElemRef,
    localScreenShareStreamRef: localScreenShareRef,
    updateLocalAudio,
    updateLocalVideo,
    setInitialDevices,
    refreshDevices,
    setAudioDevices,
    setVideoDevices,
    startScreenShare,
    stopScreenShare,
  };
}

export default useLocalMedia;

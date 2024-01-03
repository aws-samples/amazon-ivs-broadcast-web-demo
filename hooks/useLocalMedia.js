import { useCallback, useContext, useRef, useState } from 'react';
import {
  getCameraStream,
  getMicrophoneStream,
  getAvailableDevices,
  getScreenshareStream,
  getIdealDevice,
  getDisconnectedDevices,
  getConnectedDevices,
} from '@/utils/LocalMedia';
import useLocalStorage from '@/hooks/useLocalStorage';
import { UserSettingsContext } from '@/providers/UserSettingsContext';
import toast from 'react-hot-toast';
import { debounce } from '@/utils/Helpers';

function useLocalMedia() {
  const { configRef, orientation } = useContext(UserSettingsContext);

  const videoElemRef = useRef();
  const canvasElemRef = useRef();
  const localAudioStreamRef = useRef();
  const localVideoStreamRef = useRef();
  const localVideoDeviceIdRef = useRef();
  const localAudioDeviceIdRef = useRef();
  const localScreenShareRef = useRef();
  const refreshSceneRef = useRef();

  const [permissions, setPermissions] = useState(false);
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [localVideoMounted, setLocalVideoMounted] = useState(false);
  const [localAudioMounted, setLocalAudioMounted] = useState(false);
  const [enableCanvasCamera, setEnableCanvasCamera] = useState(false);

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

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return { audioDeviceId, audioStream, videoDeviceId, videoStream };
  };

  const cleanUpDevices = () => {
    navigator.mediaDevices.removeEventListener(
      'devicechange',
      handleDeviceChange
    );
  };

  const refreshDevices = async (e) => {
    const isDeviceChange = e?.type === 'devicechange';

    const {
      videoDevices: _videoDevices,
      audioDevices: _audioDevices,
      permissions,
    } = await getAvailableDevices({ savedAudioDeviceId, savedVideoDeviceId });

    const formattedAudioDevices = _audioDevices.map((device) => {
      return { label: device.label, value: device.deviceId };
    });
    const formattedVideoDevices = _videoDevices.map((device) => {
      return { label: device.label, value: device.deviceId };
    });

    var newAudioDevice;
    var newVideoDevice;

    setAudioDevices((prevState) => {
      if (!isDeviceChange) return formattedAudioDevices;
      if (prevState.length > formattedAudioDevices.length) {
        // Device disconnected
        const [disconnectedDevice] = getDisconnectedDevices(
          prevState,
          formattedAudioDevices
        );
        if (disconnectedDevice.value === localAudioDeviceIdRef.current) {
          // Currently active device was disconnected
          newAudioDevice =
            formattedAudioDevices.find(({ value }) => value === 'default') ||
            formattedAudioDevices[0];
        }

        toast.error(`Device disconnected: ${disconnectedDevice.label}`, {
          id: 'MIC_DEVICE_UPDATE',
        });
      } else if (prevState.length < formattedAudioDevices.length) {
        // Device connected
        const [connectedDevice] = getConnectedDevices(
          prevState,
          formattedAudioDevices
        );
        toast.success(`Device connected: ${connectedDevice.label}`, {
          id: 'MIC_DEVICE_UPDATE',
        });
      }
      return formattedAudioDevices;
    });

    setVideoDevices((prevState) => {
      if (!isDeviceChange) return formattedVideoDevices;
      if (prevState.length > formattedVideoDevices.length) {
        // Device disconnected
        const [disconnectedDevice] = getDisconnectedDevices(
          prevState,
          formattedVideoDevices
        );

        if (disconnectedDevice.value === localAudioDeviceIdRef.current) {
          // Currently active device was disconnected
          newVideoDevice =
            formattedVideoDevices.find(({ value }) => value === 'default') ||
            formattedVideoDevices[0];
        }

        toast.error(`Device disconnected: ${disconnectedDevice.label}`, {
          id: 'CAM_DEVICE_UPDATE',
        });
      } else if (prevState.length < formattedVideoDevices.length) {
        // Device connected
        const [connectedDevice] = getConnectedDevices(
          prevState,
          formattedVideoDevices
        );
        toast.success(`Device connected: ${connectedDevice.label}`, {
          id: 'CAM_DEVICE_UPDATE',
        });
      }
      return formattedVideoDevices;
    });

    var newAudioStream, newVideoStream;
    if (newAudioDevice)
      newAudioStream = await updateLocalAudio(
        newAudioDevice.value,
        formattedAudioDevices
      );
    if (newVideoDevice)
      newVideoStream = await updateLocalVideo(
        newVideoDevice.value,
        formattedVideoDevices
      );

    if (refreshSceneRef.current) {
      const newParams = {};
      if (newAudioStream) newParams.micContent = newAudioStream;
      if (newAudioDevice) newParams.micId = newAudioDevice.value;
      if (newVideoStream) newParams.cameraContent = newVideoStream;
      if (newVideoDevice) newParams.cameraId = newVideoDevice.value;
      refreshSceneRef.current(newParams);
    }

    setPermissions(permissions);

    return {
      audioDevices: formattedAudioDevices,
      videoDevices: formattedVideoDevices,
      permissions,
    };
  };

  const updateLocalAudio = async (deviceId, _audioDevices = audioDevices) => {
    try {
      localAudioStreamRef.current &&
        localAudioStreamRef.current.getTracks()[0].stop();
    } catch (err) {
      console.error(err);
    }
    const audioStream = await setLocalAudioFromId(deviceId);
    localAudioDeviceIdRef.current = deviceId;
    setSavedAudioDeviceId(deviceId);

    const device = _audioDevices.find((device) => {
      return device.value === deviceId;
    });
    if (device) {
      toast.success(`Changed mic: ${device.label}`, {
        id: 'MIC_DEVICE_UPDATE',
        duration: 5000,
      });
    }

    return audioStream;
  };

  const updateLocalVideo = async (deviceId, _videoDevices = videoDevices) => {
    try {
      localVideoStreamRef.current &&
        localVideoStreamRef.current.getTracks()[0].stop();
    } catch (err) {
      console.error(err);
    }

    const videoStream = await setLocalVideoFromId(deviceId);
    localVideoDeviceIdRef.current = deviceId;
    setSavedVideoDeviceId(deviceId);

    const device = _videoDevices.find((device) => device.value === deviceId);
    if (device) {
      toast.success(`Changed camera: ${device.label}`, {
        id: 'CAM_DEVICE_UPDATE',
        duration: 5000,
      });
    }

    return videoStream;
  };

  const startScreenShare = async () => {
    let screenShareStream = undefined;
    try {
      screenShareStream = await getScreenshareStream();
      localScreenShareRef.current = screenShareStream;
    } catch (err) {
      console.error(err);
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

  const handleDeviceChange = debounce(refreshDevices, 1000);

  return {
    permissions,
    localVideoMounted,
    localAudioMounted,
    audioDevices,
    videoDevices,
    localAudioStreamRef,
    localVideoStreamRef,
    localAudioDeviceId: savedAudioDeviceId,
    localVideoDeviceId: savedVideoDeviceId,
    videoElemRef,
    canvasElemRef,
    refreshSceneRef,
    localScreenShareStreamRef: localScreenShareRef,
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
}

export default useLocalMedia;

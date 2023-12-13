import useLocalStorage from '@/hooks/useLocalStorage';
import { useEffect, useRef } from 'react';
import { isMobileOnly } from 'react-device-detect';

const DEFAULT_RESOLUTION = 720;
const DEFAULT_INGEST = '';
const CHANNEL_TYPES = {
  BASIC: 'BASIC',
  STANDARD: 'STANDARD',
  ADVANCED_HD: 'ADVANCED_HD',
  ADVANCED_SD: 'ADVANCED_SD',
};

export function clearSavedSettings() {
  localStorage.removeItem('channelType');
  localStorage.removeItem('savedAudioDeviceId');
  localStorage.removeItem('savedVideoDeviceId');
  localStorage.removeItem('streamResolution');
  localStorage.removeItem('sk');
  localStorage.removeItem('orientation');
  localStorage.removeItem('ingestEndpoint');
  localStorage.removeItem('localVideoMirror');
  localStorage.removeItem('audioNoiseSuppression');
  localStorage.removeItem('autoGainControl');
  localStorage.removeItem('rememberSettings');
}

export function getSavedValuesFromLocalStorage() {
  const [saveSettings, setSaveSettings] = useLocalStorage(
    'rememberSettings',
    false,
    false
  );

  const [channelType, setChannelType] = useLocalStorage(
    'channelType',
    CHANNEL_TYPES.BASIC,
    saveSettings
  );
  const [savedAudioDeviceId, setSavedAudioDeviceId] = useLocalStorage(
    'savedAudioDeviceId',
    undefined,
    saveSettings
  );
  const [savedVideoDeviceId, setSavedVideoDeviceId] = useLocalStorage(
    'savedVideoDeviceId',
    undefined,
    saveSettings
  );
  const [orientation, setOrientation] = useLocalStorage(
    'orientation',
    isMobileOnly ? 'PORTRAIT' : 'LANDSCAPE',
    saveSettings
  );
  const [resolution, setResolution] = useLocalStorage(
    'streamResolution',
    DEFAULT_RESOLUTION,
    saveSettings
  );
  const [streamKey, setStreamKey] = useLocalStorage(
    'sk',
    undefined,
    saveSettings
  );
  const [ingestEndpoint, setIngestEndpoint] = useLocalStorage(
    'ingestEndpoint',
    DEFAULT_INGEST,
    saveSettings
  );
  const [localVideoMirror, setLocalVideoMirror] = useLocalStorage(
    'localVideoMirror',
    false,
    saveSettings
  );
  const [audioNoiseSuppression, setAudioNoiseSuppression] = useLocalStorage(
    'audioNoiseSuppression',
    true,
    saveSettings
  );
  const [autoGainControl, setAutoGainControl] = useLocalStorage(
    'autoGainControl',
    true,
    saveSettings
  );

  const configRef = useRef(
    getConfigFromResolution(resolution, channelType, orientation)
  );

  useEffect(() => {
    configRef.current = getConfigFromResolution(
      resolution,
      channelType,
      orientation
    );
  }, [resolution, channelType]);

  return {
    channelType,
    setChannelType,
    savedVideoDeviceId,
    setSavedVideoDeviceId,
    savedAudioDeviceId,
    setSavedAudioDeviceId,
    orientation,
    setOrientation,
    resolution,
    setResolution,
    configRef,
    streamKey,
    setStreamKey,
    ingestEndpoint,
    setIngestEndpoint,
    localVideoMirror,
    setLocalVideoMirror,
    audioNoiseSuppression,
    setAudioNoiseSuppression,
    autoGainControl,
    setAutoGainControl,
    saveSettings,
    setSaveSettings,
  };
}

export function formatConfig({ width, height, bitrate: maxBitrate }) {
  const maxFramerate = 30;
  const streamConfig = {
    maxResolution: { width, height },
    maxBitrate,
    maxFramerate,
  };
  return streamConfig;
}

export function getConfigFromResolution(resolution, channelType, orientation) {
  const isLandscape = orientation === 'LANDSCAPE';
  var config;
  switch (resolution) {
    case '1080':
      config = {
        width: isLandscape ? 1920 : 1080,
        height: isLandscape ? 1080 : 1920,
        bitrate: channelType === 'BASIC' ? 3500 : 8500,
      };
      break;
    case '720':
      config = {
        width: isLandscape ? 1280 : 720,
        height: isLandscape ? 720 : 1280,
        bitrate: channelType === 'BASIC' ? 3500 : 6500,
      };
      break;
    case '480':
      config = {
        width: isLandscape ? 853 : 480,
        height: isLandscape ? 480 : 853,
        bitrate: channelType === 'BASIC' ? 1500 : 3500,
      };
      break;
    case '360':
      config = {
        width: isLandscape ? 640 : 360,
        height: isLandscape ? 360 : 640,
        bitrate: channelType === 'BASIC' ? 1500 : 3500,
      };
      break;
    default:
      config = {
        width: isLandscape ? 1280 : 720,
        height: isLandscape ? 720 : 1280,
        bitrate: channelType === 'BASIC' ? 3500 : 6500,
      };
      break;
  }

  config = formatConfig(config);
  return config;
}

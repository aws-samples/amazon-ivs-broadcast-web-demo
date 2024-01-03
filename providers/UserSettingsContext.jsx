import { createContext } from 'react';
import {
  getSavedValuesFromLocalStorage,
  clearSavedSettings,
} from '@/utils/UserSettings';

const UserSettingsContext = createContext({
  channelType: undefined,
  setChannelType: undefined,
  selectedVideoDeviceId: undefined,
  setSelectedVideoDeviceId: undefined,
  selectedAudioDeviceId: undefined,
  setSelectedAudioDeviceId: undefined,
  orientation: undefined,
  setOrientation: undefined,
  resolution: undefined,
  setResolution: undefined,
  configRef: undefined,
  streamKey: '',
  setStreamKey: undefined,
  ingestEndpoint: '',
  setIngestEndpoint: undefined,
  localVideoMirror: undefined,
  setLocalVideoMirror: undefined,
  audioNoiseSuppression: undefined,
  setAudioNoiseSuppression: undefined,
  autoGainControl: undefined,
  setAutoGainControl: undefined,
  saveSettings: undefined,
  setSaveSettings: undefined,
});

function UserSettingsProvider({ children }) {
  const savedValues = getSavedValuesFromLocalStorage();

  return (
    <UserSettingsContext.Provider
      value={{ clearSavedSettings, ...savedValues }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

export default UserSettingsProvider;
export { UserSettingsContext };

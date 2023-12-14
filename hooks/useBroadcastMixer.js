import { BroadcastContext } from '@/providers/BroadcastContext';
import { LocalMediaContext } from '@/providers/LocalMediaContext';
import { useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const useBroadcastMixer = () => {
  const { broadcastClientRef, IVSBroadcastClientRef } =
    useContext(BroadcastContext);
  const [micMuted, setMicMuted] = useState(false);
  const mixerRef = useRef([]);

  const deviceExists = (deviceName) => {
    const exists = broadcastClientRef.current.getAudioInputDevice(deviceName)
      ? true
      : false;
    return exists;
  };

  const addMixerDevices = async (devices) => {
    const promises = [];

    for (const { audioStream, deviceName } of devices) {
      promises.push(addMixerDevice({ audioStream, deviceName }));
    }
    await Promise.allSettled(promises);
  };

  const removeAllDevices = async (devices = mixerRef.current) => {
    const promises = [];

    for (const { deviceName } of devices) {
      promises.push(removeMixerDevice(deviceName));
    }
    await Promise.allSettled(promises);
  };

  const removeOldDevices = async (oldDevices, newDevices) => {
    // Remove devices that are not in the updated mixer
    const devicesToRemove = oldDevices.filter((oldDevice) => {
      return (
        newDevices.findIndex(
          (newDevice) => newDevice.deviceName === oldDevice.deviceName
        ) === -1
      );
    });
    await removeAllDevices(devicesToRemove);
  };

  const refreshMixer = async (devices) => {
    await removeOldDevices();

    const promises = [];

    for (const device of devices) {
      const { audioStream, deviceName } = device;
      promises.push(addMixerDevice({ audioStream, deviceName }));
    }

    await Promise.allSettled(promises);
  };

  const removeDeviceFromRef = (deviceName) => {
    const filteredMixer = mixerRef.current.filter((_device) => {
      _device.name !== deviceName;
    });
    mixerRef.current = filteredMixer;
  };

  const addMixerDevice = async ({ audioStream, deviceName }) => {
    if (deviceExists(deviceName)) {
      return;
    }
    try {
      await broadcastClientRef.current.addAudioInputDevice(
        audioStream,
        deviceName
      );
      mixerRef.current.push({ audioStream, deviceName });
    } catch (err) {
      console.error(err);
    }
  };

  const removeMixerDevice = async (deviceName) => {
    try {
      await broadcastClientRef.current.removeAudioInputDevice(deviceName);
      removeDeviceFromRef(deviceName);
    } catch (err) {
      if (
        err.code ===
        IVSBroadcastClientRef.current.Errors.REMOVE_DEVICE_NOT_FOUND_ERROR.code
      ) {
        removeDeviceFromRef(deviceName);
        console.info('Device not found:', deviceName);
      } else {
        console.error(err);
      }
    }
  };

  const getMixerDevice = (deviceName) => {
    const device = mixerRef.current.find(
      (device) => device.deviceName === deviceName
    );
    return device;
  };

  const toggleMute = (deviceName) => {
    const audioTrack = broadcastClientRef.current
      .getAudioInputDevice(deviceName)
      .getAudioTracks()[0];
    setMicMuted((prevState) => {
      audioTrack.enabled = prevState;
      // toast.success(`${prevState ? 'Mic unmuted' : 'Mic muted'}`, {
      //   id: 'MIC_STATUS',
      // });
      return !prevState;
    });
  };

  useEffect(() => {
    if (!broadcastClientRef.current) return;
    const muteIcon =
      broadcastClientRef.current.getVideoInputDevice('micMutedIcon');
    if (muteIcon) {
      muteIcon.render = micMuted;
    }
  }, [micMuted]);

  return {
    micMuted,
    setMicMuted,
    addMixerDevice,
    addMixerDevices,
    removeMixerDevice,
    removeOldDevices,
    refreshMixer,
    getMixerDevice,
    mixerDevicesRef: mixerRef,
    toggleMute,
  };
};

export default useBroadcastMixer;

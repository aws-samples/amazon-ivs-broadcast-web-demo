import { useState } from 'react';

// Keeps track of initialized audio devices.

// audioDevice:
// {
//   name(id),
//   device,
//   muted
// }

const useMixer = (initialDevice) => {
  const [mixerDevices, setMixerDevices] = useState([initialDevice]);

  // Add track
  // Adds an audio track directly to the mixer
  const addAudioTrack = async (audioLayer, client) => {
    if (!client) return;
    try {
      await client.addAudioInputDevice(audioLayer.track, audioLayer.name);
      setMixerDevices((prevState) => [...prevState, audioLayer]);
    } catch (err) {
      console.error(err);
    }
  };

  // Add Device
  // Adds an audio device to the mixer
  const addMixerDevice = async (mixerDevice, client) => {
    try {
      const { device, name, muted } = mixerDevice;
      // If it exists, remove the previous device from the canvas
      if (client.getAudioInputDevice(name)) {
        await removeMixerDevice(mixerDevice, client);
      }

      // Get the audio stream
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: device.deviceId },
      });
      // Add the audio stream to the mixer
      await client.addAudioInputDevice(audioStream, name);
      // If the device is set to muted, mute the device
      if (muted) {
        const [microphoneTrack] = client
          .getAudioInputDevice(name)
          .getAudioTracks();
        muteMixerDevice(microphoneTrack);
      }

      setMixerDevices((prevState) => [...prevState, mixerDevice]);
    } catch (err) {
      console.error(err);
    }
  };

  // Remove Device
  // Removes a device from the mixer
  const removeMixerDevice = async (mixerDevice, client) => {
    if (!mixerDevice) return;

    try {
      const { name } = mixerDevice;
      if (!name) return;
      await client.removeAudioInputDevice(name);

      setMixerDevices((prevState) =>
        prevState.filter((item) => item.name !== name)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Device Mute
  // Toggles mute for an audio device.
  // Returns TRUE if muted, FALSE if not.
  const toggleMixerDeviceMute = (mixerDevice, client, forceState) => {
    const { name, muted } = mixerDevice;
    const [microphoneTrack] = client.getAudioInputDevice(name).getAudioTracks();

    // Handle force mute or unmute
    if (forceState) {
      switch (forceState) {
        case 'MUTE':
          return muteMixerDevice(microphoneTrack);
        case 'UNMUTE':
          return unmuteMixerDevice(microphoneTrack);
        default:
          break;
      }
    } else {
      // If mute or unmute is not forced, toggle mute
      if (muted) {
        return unmuteMixerDevice(microphoneTrack);
      } else {
        return muteMixerDevice(microphoneTrack);
      }
    }
  };

  const muteMixerDevice = (microphoneTrack) => {
    microphoneTrack.enabled = false;
    return true;
  };

  const unmuteMixerDevice = (microphoneTrack) => {
    microphoneTrack.enabled = true;
    return false;
  };

  // Removes all devices from the mixer and resets to default state
  const resetMixer = async (client) => {
    const devices = mixerDevices;
    for (let i = 0; i < mixerDevices.length; i++) {
      const device = devices[i];
      try {
        await removeMixerDevice(device, client);
        // setMixerDevices((prevState) =>
        //   prevState.filter((item) => item.name !== name)
        // );
      } catch (error) {
        console.error(error);
      }
    }
  };

  return {
    mixerDevices,
    addMixerDevice,
    addAudioTrack,
    removeMixerDevice,
    toggleMixerDeviceMute,
    resetMixer,
  };
};

export default useMixer;

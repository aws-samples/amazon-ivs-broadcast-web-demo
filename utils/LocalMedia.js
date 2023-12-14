// From https://codepen.io/amazon-ivs/project/editor/ZzWobn
// From https://gitlab.aws.dev/ivs-demos/amazon-ivs-real-time-tool/-/blob/main/src/contexts/DeviceManager/helpers/helpers.ts

import toast from 'react-hot-toast';

var permissions, mediaDevices;

if (typeof window !== 'undefined') {
  permissions = navigator.permissions;
  mediaDevices = navigator.mediaDevices;
}

function checkMediaDevicesSupport() {
  if (!mediaDevices) {
    throw new Error(
      'Media device permissions can only be requested in a secure context (i.e. HTTPS).'
    );
  }
}

function isFulfilled(input) {
  return input.status === 'fulfilled';
}

function isRejected(input) {
  return input.status === 'rejected';
}

async function enumerateDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter((d) => d.kind === 'videoinput');
  if (!videoDevices.length) {
    toast.error('Error: Could not find any webcams.', {
      id: 'err-could-not-list-video-devices',
      duration: Infinity,
    });
  }

  const audioDevices = devices.filter((d) => d.kind === 'audioinput');
  if (!audioDevices.length) {
    toast.error('Error: Could not find any microphones.', {
      id: 'err-could-not-list-audio-devices',
      duration: Infinity,
    });
  }

  return {
    videoDevices,
    audioDevices,
  };
}

async function getPermissions({ savedAudioDeviceId, savedVideoDeviceId }) {
  let error;
  let mediaStream;
  let arePermissionsGranted = false;

  try {
    checkMediaDevicesSupport();

    const [cameraPermissionQueryResult, microphonePermissionQueryResult] =
      await Promise.allSettled(
        ['camera', 'microphone'].map((permissionDescriptorName) =>
          permissions.query({
            name: permissionDescriptorName,
          })
        )
      );

    const constraints = {};

    if (
      (isFulfilled(cameraPermissionQueryResult) &&
        cameraPermissionQueryResult.value.state !== 'granted') ||
      isRejected(cameraPermissionQueryResult)
    ) {
      constraints.video = {
        deviceId: { ideal: savedVideoDeviceId },
      };
    }

    if (
      (isFulfilled(microphonePermissionQueryResult) &&
        microphonePermissionQueryResult.value.state !== 'granted') ||
      isRejected(microphonePermissionQueryResult)
    ) {
      constraints.audio = {
        deviceId: { ideal: savedAudioDeviceId },
      };
    }

    if (Object.keys(constraints).length) {
      mediaStream = await mediaDevices.getUserMedia(constraints);
    }

    arePermissionsGranted = true;
  } catch (err) {
    error = new Error(err.name);
  }
  return { permissions: arePermissionsGranted, mediaStream, error };
}

async function getAvailableDevices({ savedAudioDeviceId, savedVideoDeviceId }) {
  // The following line prevents issues on Safari/FF WRT to device selects
  // and ensures the device labels are not blank
  const { permissions, mediaStream, error } = await getPermissions({
    savedAudioDeviceId,
    savedVideoDeviceId,
  });

  if (!permissions || error) {
    toast.error(
      'Error: Could not access webcams or microphones. Allow this app to access your webcams and microphones and refresh the app.',
      {
        id: 'err-permission-denied',
        duration: Infinity,
      }
    );
  }

  const { videoDevices, audioDevices } = await enumerateDevices();

  // After enumerating devices, the initial mediaStream must be stopped
  if (mediaStream) await stopMediaStream(mediaStream);

  return {
    videoDevices,
    audioDevices,
    permissions,
  };
}

async function stopMediaStream(mediaStream) {
  for (const track of mediaStream.getTracks()) {
    track.stop();
  }
}

async function getCameraStream({
  deviceId,
  width,
  height,
  facingMode,
  frameRate,
  aspectRatio,
}) {
  let cameraStream = undefined;
  const constraints = {
    video: {
      deviceId: deviceId ? { exact: deviceId } : null,
      width: {
        ideal: width,
      },
      height: {
        ideal: height,
      },
      facingMode: { ideal: facingMode },
      frameRate: { ideal: frameRate },
      aspectRatio: { ideal: aspectRatio },
    },
    audio: false,
  };
  try {
    const media = await navigator.mediaDevices.getUserMedia(constraints);
    cameraStream = media;
  } catch (err) {
    console.error('Could not get camera stream:', err.message);
  }
  return cameraStream;
}

async function getMicrophoneStream(deviceId = 'default') {
  let microphoneTrack = undefined;
  try {
    const media = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { deviceId: { exact: deviceId } },
    });
    microphoneTrack = media;
  } catch (err) {
    console.error('Could not get microphone stream:', err.message);
  }
  return microphoneTrack;
}

async function getScreenshareStream() {
  let captureStream = undefined;
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always',
        frameRate: 30,
        resizeMode: 'crop-and-scale',
      },
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
  } catch (err) {
    throw new Error(err);
  }
  return captureStream;
}

function getIdealDevice(deviceId, devices) {
  if (!devices || devices.length === 0) return undefined;
  const deviceExists = devices.reduce(
    (foundDevice, currentDevice) =>
      foundDevice || currentDevice.value == deviceId,
    false
  );
  return deviceExists ? deviceId : devices[0].value;
}

function getDisconnectedDevices(oldDeviceArr, newDeviceArr) {
  return oldDeviceArr.filter(
    (oldDevice) =>
      newDeviceArr.findIndex(
        (newDevice) => newDevice.value === oldDevice.value
      ) === -1
  );
}

function getConnectedDevices(oldDeviceArr, newDeviceArr) {
  return newDeviceArr.filter(
    (newDevice) =>
      oldDeviceArr.findIndex(
        (oldDevice) => oldDevice.value === newDevice.value
      ) === -1
  );
}

export {
  getAvailableDevices,
  getCameraStream,
  getMicrophoneStream,
  getScreenshareStream,
  stopMediaStream,
  getIdealDevice,
  getDisconnectedDevices,
  getConnectedDevices,
};

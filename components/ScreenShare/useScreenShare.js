import { useState } from 'react';

const SCREENSHARE_LAYER_NAME = 'screen';
const SCREENSHARE_MIXER_NAME = 'screen-audio';
const CAM_LAYER_NAME = 'camera';
const CAM_PADDING = 20;

const useScreenShare = () => {
  const [captureStream, setCaptureStream] = useState(null);

  const getCaptureStream = async () => {
    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia({
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
      return captureStream;
    } catch (err) {
      return err;
    }
  };

  const startAudioShare = async (
    screenCaptureStreeam,
    addAudioTrack,
    client
  ) => {
    const [screenAudioTrack] = screenCaptureStreeam.getAudioTracks();
    if (screenAudioTrack) {
      const audioLayer = {
        name: SCREENSHARE_MIXER_NAME,
        track: screenCaptureStreeam,
        muted: screenAudioTrack.muted || false,
      };
      addAudioTrack(audioLayer, client);
    }
  };

  const renderScreenShare = (
    screenCaptureStream,
    activeVideoDevice,
    camMuted,
    updateLayer,
    addLayer,
    client,
    canvas
  ) => {
    const layer = {
      stream: screenCaptureStream,
      name: SCREENSHARE_LAYER_NAME,
      index: 3,
      visible: true,
      type: 'SCREENSHARE',
    };

    let camLayer = {
      device: activeVideoDevice,
      name: CAM_LAYER_NAME,
      index: 4,
      visible: camMuted,
      x: canvas.width - canvas.width / 4 - CAM_PADDING,
      y: canvas.height - canvas.height / 4 - CAM_PADDING,
      width: canvas.width / 4,
      height: canvas.height / 4,
      type: 'VIDEO',
    };

    updateLayer(camLayer, client);
    addLayer(layer, client);
  };

  // Function to get the captureStream from the browser
  const startScreenShare = async (
    activeVideoDevice,
    camMuted,
    updateLayer,
    addLayer,
    removeLayer,
    removeMixerDevice,
    addAudioTrack,
    canvas,
    client
  ) => {
    try {
      const screenCaptureStream = await getCaptureStream();
      const [screenTrack] = screenCaptureStream.getVideoTracks();

      screenTrack.onended = async () => {
        stopScreenShare(
          activeVideoDevice,
          camMuted,
          removeLayer,
          removeMixerDevice,
          updateLayer,
          client
        );
      };

      renderScreenShare(
        screenCaptureStream,
        activeVideoDevice,
        camMuted,
        updateLayer,
        addLayer,
        client,
        canvas
      );

      startAudioShare(screenCaptureStream, addAudioTrack, client);
      setCaptureStream(screenCaptureStream);
    } catch (err) {
      return err;
    }
  };

  const stopScreenShare = async (
    activeVideoDevice,
    camMuted,
    removeLayer,
    removeMixerDevice,
    updateLayer,
    client
  ) => {
    // Stop screensharing
    if (captureStream?.getTracks()) {
      for (const track of captureStream.getTracks()) {
        track.stop();
      }
    }

    // End screensharing
    await removeLayer(
      { name: SCREENSHARE_LAYER_NAME, type: 'SCREENSHARE' },
      client
    );

    // Remove screenshare audio from the mixer, if it exists
    if (captureStream && captureStream.getAudioTracks().length) {
      await removeMixerDevice({ name: SCREENSHARE_MIXER_NAME }, client);
    }

    // Move the camera back into the original position
    let camLayer = {
      device: activeVideoDevice,
      name: CAM_LAYER_NAME,
      index: 4,
      visible: camMuted,
      type: 'VIDEO',
    };
    updateLayer(camLayer, client);
    setCaptureStream(null);
  };

  return {
    captureStream,
    startScreenShare,
    stopScreenShare,
  };
};

export default useScreenShare;

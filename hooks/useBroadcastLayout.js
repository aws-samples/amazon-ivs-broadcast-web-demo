import { useContext, useRef, useState } from 'react';
import {
  DEFAULT_TEMPLATE,
  SCREENSHARE_TEMPLATE,
} from '@/utils/BroadcastLayoutTemplates';
import { BroadcastContext } from '@/providers/BroadcastContext';
import {
  calcScaledCoords,
  formatPositionFromDimensions,
} from '@/utils/BroadcastLayout';
import { LocalMediaContext } from '@/providers/LocalMediaContext';
import { BroadcastMixerContext } from '@/providers/BroadcastMixerContext';
import toast from 'react-hot-toast';

const useBroadcastLayout = () => {
  const { broadcastClientRef, IVSBroadcastClientRef } =
    useContext(BroadcastContext);
  const {
    canvasElemRef,
    localVideoStreamRef,
    localAudioStreamRef,
    startScreenShare,
    stopScreenShare,
    localVideoDeviceId,
    localAudioDeviceId,
    localScreenShareStreamRef,
    enableCanvasCamera,
  } = useContext(LocalMediaContext);
  const {
    micMuted,
    mixerDevicesRef,
    removeMixerDevice,
    addMixerDevice,
    addMixerDevices,
    removeOldDevices,
  } = useContext(BroadcastMixerContext);

  const [camActive, setCamActive] = useState(true);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const layersRef = useRef([]);
  const activeSceneRef = useRef(undefined);

  const toggleCamVisiblity = (cameraId) => {
    const currentCam = broadcastClientRef.current.getVideoInputDevice(cameraId);
    const currentVideoTrack = localVideoStreamRef.current.getVideoTracks()[0];
    setCamActive((prevState) => {
      const nextState = !prevState;
      currentVideoTrack.enabled = nextState;
      currentCam.render = nextState;
      // toast.success(`${nextState ? 'Camera shown' : 'Camera hidden'}`, {
      //   id: 'CAMERA_STATE',
      // });
      return nextState;
    });
  };

  const stopScreenSharing = async () => {
    await stopScreenShare();
    removeMixerDevice(localScreenShareStreamRef.current.id);
    const cameraContent = enableCanvasCamera
      ? canvasElemRef.current
      : localVideoStreamRef.current;
    showFullScreenCam({
      cameraStream: cameraContent,
      cameraId: localVideoDeviceId,
      cameraVisible: camActive,
      micStream: localAudioStreamRef.current,
      micId: localAudioDeviceId,
      micActive: !micMuted,
    });
    setScreenShareActive(false);
    toast.success('Screen share stopped', { id: 'SCREENSHARE_STATUS' });
  };

  const startScreenSharing = async () => {
    const captureStream = await startScreenShare();

    if (!captureStream) return;

    const [screenTrack] = captureStream.getVideoTracks();
    const [audioTrack] = captureStream.getAudioTracks();

    if (screenTrack)
      screenTrack.onended = async () => {
        stopScreenSharing();
      };
    if (audioTrack)
      await addMixerDevice({
        audioStream: captureStream,
        deviceName: captureStream.id,
      });
    if (screenTrack || audioTrack) {
      const cameraContent = enableCanvasCamera
        ? canvasElemRef.current
        : localVideoStreamRef.current;
      showScreenShare({
        cameraStream: cameraContent,
        cameraId: localVideoDeviceId,
        cameraVisible: camActive,
        cameraIsCanvas: enableCanvasCamera,
        micStream: localAudioStreamRef.current,
        micId: localAudioDeviceId,
        screenShareStream: captureStream,
        screenShareId: captureStream.id,
        screenAudioContent: captureStream,
        screenAudioId: captureStream.id,
      });
      localScreenShareStreamRef.current = captureStream;
      setScreenShareActive(true);
      toast.success('Screen share started', { id: 'SCREENSHARE_STATUS' });
    }
  };

  const toggleScreenSharing = async () => {
    if (screenShareActive) {
      await stopScreenSharing();
    } else {
      await startScreenSharing();
    }
  };

  const addLayerToRef = (layer) => {
    if (findLayerIndex(layer) > -1) return;
    layersRef.current.push(layer);
  };

  const findLayerIndex = (layer) => {
    return layersRef.current.findIndex(
      (savedLayer) => savedLayer.name === layer.name
    );
  };

  const updateLayer = (layer) => {
    const layerIndex = findLayerIndex(layer);
    if (layerIndex !== -1) {
      layersRef.current[layerIndex] = layer;
    }
  };

  const layerExists = (layerName) => {
    const exists = broadcastClientRef.current.getVideoInputDevice(layerName)
      ? true
      : false;
    return exists;
  };

  const removeLayerFromRef = (layerName) => {
    const filteredLayers = layersRef.current.filter((layer, i) => {
      layer.name !== layerName;
    });
    layersRef.current = filteredLayers;
  };

  const loadImage = async (img) => {
    return new Promise((resolve, reject) => {
      img.onload = async () => {
        resolve(true);
      };
      img.onerror = async () => {
        reject(false);
      };
    });
  };

  const addImageLayer = async ({ imageSrc, name, position, visible }) => {
    if (layerExists(name)) removeImageLayer({ name });

    const img = new Image();
    img.src = `${imageSrc}`;
    await loadImage(img);
    try {
      await broadcastClientRef.current.addImageSource(img, name, position);
      if (!visible) {
        const addedDevice =
          await broadcastClientRef.current.getVideoInputDevice(name);
        addedDevice.render = false;
      }
      addLayerToRef({ name, type: 'image' });
    } catch (err) {
      console.error(err);
    }
  };

  const addVideoLayer = async ({ videoElem, name, position, visible }) => {
    if (layerExists(name)) removeImageLayer({ name });
    try {
      await broadcastClientRef.current.addImageSource(
        videoElem,
        name,
        position
      );
      if (!visible) {
        const addedDevice =
          await broadcastClientRef.current.getVideoInputDevice(name);
        addedDevice.render = false;
      }
      addLayerToRef({ name, type: 'video' });
    } catch (err) {
      console.error(err);
    }
  };

  const removeImageLayer = async ({ name }) => {
    try {
      await broadcastClientRef.current.removeImage(name);
      removeLayerFromRef(name);
    } catch (err) {
      if (
        err.code ===
        IVSBroadcastClientRef.current.Errors.REMOVE_IMAGE_NOT_FOUND_ERROR.code
      ) {
        removeLayerFromRef(name);
        console.info('Layer not found:', name);
      } else {
        console.error(err);
      }
    }
  };

  const addOrUpdateDeviceLayer = async ({
    deviceStream,
    name,
    position,
    visible,
  }) => {
    if (layerExists(name)) {
      await updateDeviceLayer({ name, position, visible });
    } else {
      await addDeviceLayer({ deviceStream, name, position, visible });
    }
  };

  const addDeviceLayer = async ({ deviceStream, name, position, visible }) => {
    try {
      await broadcastClientRef.current.addVideoInputDevice(
        deviceStream,
        name,
        position
      );

      addLayerToRef({ name, type: 'device', visible });
    } catch (err) {
      console.error(err);
    }
  };

  const updateDeviceLayer = async ({ name, position }) => {
    await broadcastClientRef.current.updateVideoDeviceComposition(
      name,
      position
    );
    updateLayer({ name, type: 'device' });
  };

  const removeDeviceLayer = async ({ name }) => {
    try {
      await broadcastClientRef.current.removeVideoInputDevice(name);
      removeLayerFromRef(name);
    } catch (err) {
      if (
        err.code ===
        IVSBroadcastClientRef.current.Errors.REMOVE_DEVICE_NOT_FOUND_ERROR.code
      ) {
        removeLayerFromRef(name);
        console.info('Layer not found:', name);
      } else {
        console.error(err);
      }
    }
  };

  const addLayerFromSlot = async ({
    type,
    content,
    name,
    position,
    visible,
  }) => {
    switch (type) {
      case 'device':
        await addOrUpdateDeviceLayer({
          deviceStream: content,
          name,
          position,
          visible,
        });
        break;
      case 'video':
        await addVideoLayer({ videoElem: content, name, position, visible });
        break;
      case 'image':
        await addImageLayer({ imageSrc: content, name, position, visible });
        break;
      default:
        break;
    }
  };

  const addSlots = async (slots) => {
    // For each slot in the template, add an image or video layer at the location described by the slots
    const promises = [];

    for (const slot of slots) {
      const { name, type, dimensions, visible, content, resize } = slot;
      const baseCanvasSize = broadcastClientRef.current.getCanvasDimensions();

      let calculatedDimensions = dimensions;
      if (resize) {
        if (resize.mode === 'FILL') {
          const { width, height } = resize.naturalSize;
          calculatedDimensions = calcScaledCoords(
            width,
            height,
            baseCanvasSize.width,
            baseCanvasSize.height
          );
          calculatedDimensions.z = dimensions.z;
        }
      }

      const position = formatPositionFromDimensions({
        dimensions: calculatedDimensions,
        baseCanvasSize,
      });

      promises.push(
        addLayerFromSlot({ type, content, name, position, visible })
      );
    }

    await Promise.allSettled(promises);
  };

  const setSceneFromTemplate = async (template) => {
    const { mixer, slots } = template;

    // If there is a current scene, remove layers that are disappearing
    if (activeSceneRef.current) {
      await removeOldLayers(activeSceneRef.current.slots, slots);
      await removeOldDevices(mixerDevicesRef.current, mixer);
    }

    await addSlots(slots);
    await addMixerDevices(mixer);
    activeSceneRef.current = template;
  };

  const removeOldLayers = async (oldScene, newScene) => {
    const newSlotNames = newScene.map((slot) => {
      const { name, type } = slot;
      return { name, type };
    });
    const oldSlotNames = oldScene.map((slot) => {
      const { name, type } = slot;
      return { name, type };
    });

    // Remove layers that are not in the updated scene
    const layersToRemove = oldSlotNames.filter((oldSlot) => {
      return (
        newSlotNames.findIndex((newSlot) => newSlot.name === oldSlot.name) ===
        -1
      );
    });

    await removeAllLayers(layersToRemove);
  };

  const refreshCurrentScene = async (newProps) => {
    const { update } = activeSceneRef.current;
    const updatedScene = update(newProps);
    await setSceneFromTemplate(updatedScene);
  };

  const removeAllLayers = async (layers = layersRef.current) => {
    const promises = [];

    for (const layer of layers) {
      if (layer === undefined) continue;
      const { name, type } = layer;
      switch (type) {
        case 'device':
          promises.push(removeDeviceLayer({ name }));
          break;
        case 'video':
          promises.push(removeImageLayer({ name }));
          break;
        case 'image':
          promises.push(removeImageLayer({ name }));
          break;
        default:
          break;
      }
    }
    await Promise.allSettled(promises);
  };

  const showScreenShare = async ({
    cameraStream,
    cameraId,
    cameraVisible = true,
    cameraIsCanvas = false,
    showMuteIcon = micMuted,
    micStream,
    micId,
    screenShareStream,
    screenShareId,
    screenAudioContent,
    screenAudioId,
  }) => {
    const screenShareScene = SCREENSHARE_TEMPLATE({
      cameraContent: cameraStream,
      cameraId: cameraId,
      cameraVisible: cameraVisible,
      cameraIsCanvas: cameraIsCanvas,
      screenShareContent: screenShareStream,
      screenShareId: screenShareId,
      cameraOffContent: '/assets/camera-off.png',
      showMuteIcon: showMuteIcon,
      micMutedContent: '/assets/mic-off.png',
      backgroundContent: '/assets/camera-bg.png',
      micContent: micStream,
      micId: micId,
      screenAudioContent: screenAudioContent,
      screenAudioId: screenAudioId,
    });
    await setSceneFromTemplate(screenShareScene);
    setScreenShareActive(true);
  };

  const showFullScreenCam = async ({
    cameraStream,
    cameraId,
    cameraVisible = true,
    cameraIsCanvas,
    micStream,
    micId,
    showMuteIcon = micMuted,
  }) => {
    let cameraResize = undefined;
    if (!cameraIsCanvas) {
      const { width, height } = cameraStream.getTracks()[0].getSettings();
      cameraResize = {
        mode: 'FILL',
        naturalSize: { width, height },
      };
    }
    const fullScreenCam = DEFAULT_TEMPLATE({
      cameraContent: cameraStream,
      cameraId: cameraId,
      cameraVisible: cameraVisible,
      cameraIsCanvas: cameraIsCanvas,
      cameraResize: cameraResize,
      cameraOffContent: '/assets/camera-off.png',
      showMuteIcon: showMuteIcon,
      micMutedContent: '/assets/mic-off.png',
      backgroundContent: '/assets/camera-bg.png',
      micContent: micStream,
      micId: micId,
    });
    await setSceneFromTemplate(fullScreenCam);
    setScreenShareActive(false);
  };

  return {
    layersRef,
    camActive,
    setCamActive,
    screenShareActive,
    toggleScreenSharing,
    toggleCamVisiblity,
    showScreenShare,
    showFullScreenCam,
    refreshCurrentScene,
    removeAllLayers,
  };
};

export default useBroadcastLayout;

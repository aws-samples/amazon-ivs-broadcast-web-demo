import { useState } from 'react';
import { isIOS, isAndroid } from 'react-device-detect';

// Keeps track of layer state on the canvas.

// A layer contains the following data:
// {
//   name(id),
//   index,
//   x,
//   y,
//   width,
//   height,
//   device,
//   type,
// }

const useLayers = (initialLayer) => {
  const [layers, setLayers] = useState([initialLayer]);

  // Update Layer
  // Adds a layer to the layer array and draws it to the canvas
  const updateLayer = async (layer, client) => {
    switch (layer.type) {
      case 'VIDEO':
        updateSDKLayer(layer, client);
        break;
      case 'SCREENSHARE':
        updateSDKLayer(layer, client);
        break;
      case 'IMAGE':
        updateSDKLayer(layer, client);
        break;
      default:
        break;
    }
  };

  // Updates a layer
  const updateSDKLayer = async (layer, client) => {
    try {
      const { name, device, type, ...layerProps } = layer;
      await client.updateVideoDeviceComposition(name, layerProps);
      setLayer(layer);
    } catch (err) {
      throw Error(err);
    }
  };

  // Add Layer
  // Adds a layer to the layer array and draws it to the canvas
  const addLayer = async (layer, client) => {
    try {
      switch (layer.type) {
        case 'VIDEO':
          await addVideoLayer(layer, client);
          break;
        case 'SCREENSHARE':
          await addScreenshareLayer(layer, client);
          break;
        case 'IMAGE':
          await addImageLayer(layer, client);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Adds a video layer
  const addVideoLayer = async (layer, client) => {
    try {
      if (layer.visible) {
        const { name, device, ...layerProps } = layer;

        // If a layer with the same name is already added, remove it
        if (client.getVideoInputDevice(layer.name)) {
          await removeLayer(layer, client);
        }

        // Width: 1920, Height: 1080 is 16:9 "1080p"
        // Width: 3840, Height: 2160 is 16:9 "4k"
        let width = { ideal: 1280, max: 3840 };
        let height = { ideal: 720, max: 2160 };
        let aspect = { ideal: 16 / 9 };

        // If the user is on a mobile device, flip the width and height when in portrait
        // This fixes a common issue on iOS and Android
        if (isIOS || isAndroid) {
          width = { ideal: 720, max: 2160 };
          height = { ideal: 1280, max: 3840 };
          aspect = { ideal: 9 / 16 };
        }

        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: device.deviceId },
            width: {
              ideal: width.ideal,
              max: width.max,
            },
            height: {
              ideal: height.ideal,
              max: height.max,
            },
          },
          audio: true,
          aspectRatio: aspect.ideal,
          frameRate: 30,
        });

        await client.addVideoInputDevice(cameraStream, name, layerProps);
      }
      setLayers((prevState) => [...prevState, layer]);
    } catch (err) {
      throw Error(err);
    }
  };

  // Adds a screenshare layer
  const addScreenshareLayer = async (layer, client) => {
    try {
      if (layer.visible) {
        const { name, stream, ...layerProps } = layer;

        // If a layer with the same name is already added, remove it
        if (client.getVideoInputDevice(layer.name)) {
          await removeLayer(layer, client);
        }

        await client.addVideoInputDevice(stream, name, layerProps);
      }
      setLayers((prevState) => [...prevState, layer]);
    } catch (err) {
      throw Error(err);
    }
  };

  // Adds an image layer
  const addImageLayer = async (layer, client) => {
    try {
      const { name, imageSrc, type, ...layerProps } = layer;

      // If a layer with the same name is already added, throw an error
      if (client.getVideoInputDevice(layer.name)) {
        await removeLayer(layer, client);
      }

      const img = new Image();
      img.src = `${imageSrc}`;

      img.addEventListener(
        'load',
        async () => {
          await client.addImageSource(img, name, layerProps);
          setLayers((prevState) => [...prevState, layer]);
        },
        { once: true }
      );
    } catch (err) {
      throw Error(err);
    }
  };

  // Remove layer
  // Removes a layer from the layer array and removes it from the canvas
  const removeLayer = async (layer, client) => {
    if (!layer) return;
    try {
      const { name } = layer;
      if (!name) return;
      switch (layer.type) {
        case 'VIDEO':
          const videoStream = client.getVideoInputDevice(name);
          if (videoStream) {
            for (const track of videoStream.source.getVideoTracks()) {
              track.stop();
            }
          }
          await client.removeVideoInputDevice(name);
          break;
        case 'SCREENSHARE':
          const screenShareStream = client.getVideoInputDevice(name);
          if (screenShareStream) {
            for (const track of screenShareStream.source.getVideoTracks()) {
              track.stop();
            }
          }
          await client.removeVideoInputDevice(name);
          break;
        case 'IMAGE':
          await client.removeImage(name);
          break;
        default:
          break;
      }
      setLayers((prevState) =>
        prevState.filter((layer) => layer.name !== name)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Set layer
  // Sets a layer given a layer reference. Returns void.
  const setLayer = (layer) => {
    const foundIndex = layers.findIndex((l) => l.name === layer.name);
    setLayers((prevState) => {
      prevState[foundIndex] = layer;
      return prevState;
    });
  };

  // Removes all layers and resets to default state
  const resetLayers = async (client) => {
    const localLayers = layers;
    for (let i = 0; i < localLayers.length; i++) {
      const layer = localLayers[i];
      if (!layer) break;
      try {
        await removeLayer(layer, client);
        // setLayers((prevState) => prevState.filter((layer) => layer.name !== name));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return {
    updateLayer,
    addLayer,
    removeLayer,
    resetLayers,
  };
};

export default useLayers;

import { useEffect, useState } from "react";

// Keeps track of layer state on the canvas.

// Layer:
// {
//   name(id),
//   index,
//   x,
//   y,
//   width,
//   height,
//   visible,
//   device?
// }

const useLayers = (initialLayer, initialCanvas) => {
  const [layers, setLayers] = useState([initialLayer]);
  const [canvasSize, setCanvasSize] = useState(initialCanvas);

  // Update Layer
  // Adds a layer to the layer array and draws it to the canvas
  const updateLayer = async (layer, client) => {
    switch (layer.type) {
      case "VIDEO":
        updateVideoLayer(layer, client);
        break;
      case "SCREENSHARE":
        updateVideoLayer(layer, client);
        break;
      case "IMAGE":
        updateVideoLayer(layer, client);
        break;
      default:
        break;
    }
  };
  // Updates a video layer
  const updateVideoLayer = async (layer, client) => {
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
        case "VIDEO":
          await addVideoLayer(layer, client);
          break;
        case "SCREENSHARE":
          await addScreenshareLayer(layer, client);
          break;
        case "IMAGE":
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
      // If a layer with the same name is already added, remove it
      if (layer.visible) {
        const { name, device, ...layerProps } = layer;
  
        if (client.getVideoInputDevice(layer.name)) {
          // console.error("Layer already exists:", layer);
          removeLayer(layer, client);
        }
  
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: device.deviceId },
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
          // console.error("Layer already exists:", layer);
          removeLayer(layer, client);
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
        // console.error("Layer already exists:", layer);
        removeLayer(layer, client);
      }
  
      const img = new Image();
      img.src = `${imageSrc}`;
  
      img.addEventListener(
        "load",
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
  // Removes a layer from the layer array and removelocs it from the canvas
  const removeLayer = async (layer, client) => {
    try {
      const { name, device, type, ...layerProps } = layer;
      switch (layer.type) {
        case "VIDEO":
          await client.removeVideoInputDevice(name);
          break;
        case "SCREENSHARE":
          await client.removeVideoInputDevice(name);
          break;
        case "IMAGE":
          await client.removeImage(name);
          break;
        default:
          break;
      }
      setLayers((prevState) => prevState.filter((layer) => layer.name !== name));
    } catch (err) {
      console.error(err);
    }
  };

  // Show layer
  // Adds the layer to the canvas and marks it as visible
  const showLayer = async (layer, client) => {};

  // Hide layer
  // Removes the layer from the canvas, and marks it as not visible
  const hideLayer = async (layer, client) => {};

  // Toggle layer
  // Toggles show or hide layer based on whether the layer is shown or hidden
  const toggleLayer = async (layer, client) => {};

  // Get layer
  // Gets a layer by name. Returns the layer if found,
  // Returns undefined if not found.
  const getLayer = (layer) => {
    const foundLayer = layers.find((l) => l.name === layer.name);
    return foundLayer;
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

  // Reset layers
  // Forces an update to reset layer rendering.
  // If hardReset is set to true, removes and adds all active layers from the preview
  const resetLayers = async (client, hardReset, oldClient) => {
    const localLayers = layers;
    for (let i = 0; i < localLayers.length; i++) {
      const layer = localLayers[i];
      if (!layer) break;
      try {
        if (hardReset) {
          await removeLayer(layer, oldClient);
          // await addLayer(layer, client);
        } else {
          await updateLayer(layer, client);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Sort layers
  // Sorts list based on index and return it
  const sortByIndex = (list) => {
    return list.sort((a, b) => (a.index > b.index ? 1 : -1));
  };

  return {
    layers,
    setCanvasSize,
    updateLayer,
    addLayer,
    removeLayer,
    hideLayer,
    showLayer,
    toggleLayer,
    resetLayers,
  };
};

export default useLayers;

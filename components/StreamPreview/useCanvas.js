import { useState } from 'react';

const useCanvas = (dimensions) => {
  const [dimensions, setDimensions] = useState(dimensions);
  const [layers, setLayers] = useState([]);

  return {
    dimensions,
    setDimensions,
    layers, 
    setLayers
  }
};

export default useCanvas;
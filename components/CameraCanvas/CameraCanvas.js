import { LocalMediaContext } from '@/providers/LocalMediaContext';
import React, { useCallback, useContext, useEffect } from 'react';

export default function CameraCanvas({ videoStream, width, height }) {
  const { videoElemRef, canvasElemRef } = useContext(LocalMediaContext);

  useEffect(() => {
    videoElemRef.current.width = width;
    videoElemRef.current.height = height;
    canvasElemRef.current.width = width;
    canvasElemRef.current.height = height;
    videoElemRef.current.srcObject = videoStream;
  }, [width, height, videoStream]);

  const calcScaledCoords = useCallback(
    (w, h) => {
      // get the scale
      var scale = Math.max(width / w, height / h);
      // get the top left position of the image
      var x = width / 2 - (w / 2) * scale;
      var y = height / 2 - (h / 2) * scale;
      return { x, y, w: w * scale, h: h * scale };
    },
    [width, height]
  );

  const handlePlay = () => {
    const ctx = canvasElemRef.current.getContext('2d');
    function step() {
      const coords = calcScaledCoords(
        videoElemRef.current.videoWidth,
        videoElemRef.current.videoHeight
      );
      ctx.drawImage(
        videoElemRef.current,
        coords.x,
        coords.y,
        coords.w,
        coords.h
      );
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  return (
    <>
      <video
        ref={videoElemRef}
        muted
        autoPlay={true}
        playsInline={true}
        className='absolute max-w-[100dvw] max-h-[100dvh] -z-10 object-cover'
        onPlay={handlePlay}
      ></video>
      <canvas className='absolute -z-10' ref={canvasElemRef} hidden></canvas>
    </>
  );
}

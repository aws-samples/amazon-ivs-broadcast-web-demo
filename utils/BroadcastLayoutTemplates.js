export const DEFAULT_TEMPLATE = ({
  cameraContent,
  cameraId,
  cameraOffContent,
  backgroundContent,
  micId,
  micContent,
}) => {
  return {
    name: 'defaultTemplate',
    slots: [
      {
        name: cameraId,
        type: 'device',
        dimensions: {
          x: 0,
          y: 0,
          z: 2,
          w: 'CANVAS_WIDTH',
          h: 'CANVAS_HEIGHT',
          visible: true,
        },
        content: cameraContent,
      },
      {
        name: 'cameraHiddenIcon',
        type: 'image',
        dimensions: {
          x: 'CANVAS_WIDTH * 0.5 - LAYER_WIDTH * 0.5',
          y: 'CANVAS_HEIGHT * 0.5 - LAYER_HEIGHT * 0.5',
          z: 1,
          w: 'CANVAS_WIDTH * 0.25',
          h: 'CANVAS_HEIGHT * 0.25',
          visible: true,
        },
        content: cameraOffContent,
      },
      {
        name: 'background',
        type: 'image',
        dimensions: {
          x: 0,
          y: 0,
          z: 0,
          w: 'CANVAS_WIDTH',
          h: 'CANVAS_HEIGHT',
          visible: true,
        },
        content: backgroundContent,
      },
    ],
    mixer: [
      {
        deviceName: micId,
        audioStream: micContent,
      },
    ],
    update: ({
      cameraContent: _cameraContent,
      cameraId: _cameraId,
      cameraOffContent: _cameraOffContent,
      backgroundContent: _backgroundContent,
      micId: _micId,
      micContent: _micContent,
    }) => {
      const newProps = {
        cameraContent: _cameraContent || cameraContent,
        cameraId: _cameraId || cameraId,
        cameraOffContent: _cameraOffContent || cameraOffContent,
        backgroundContent: _backgroundContent || backgroundContent,
        micContent: _micContent || micContent,
        micId: _micId || micId,
      };
      return DEFAULT_TEMPLATE(newProps);
    },
  };
};

export const VIDEO_TEMPLATE = ({
  cameraContent,
  cameraId,
  cameraOffContent,
  backgroundContent,
  micId,
  micContent,
}) => {
  return {
    name: 'videoTemplate',
    slots: [
      {
        name: cameraId,
        type: 'video',
        dimensions: {
          x: 0,
          y: 0,
          z: 2,
          w: 'CANVAS_WIDTH',
          h: 'CANVAS_HEIGHT',
          visible: true,
        },
        content: cameraContent,
      },
      {
        name: 'cameraHiddenIcon',
        type: 'image',
        dimensions: {
          x: 'CANVAS_WIDTH * 0.5 - LAYER_WIDTH * 0.5',
          y: 'CANVAS_HEIGHT * 0.5 - LAYER_HEIGHT * 0.5',
          z: 1,
          w: 'CANVAS_WIDTH * 0.25',
          h: 'CANVAS_HEIGHT * 0.25',
          visible: true,
        },
        content: cameraOffContent,
      },
      {
        name: 'background',
        type: 'image',
        dimensions: {
          x: 0,
          y: 0,
          z: 0,
          w: 'CANVAS_WIDTH',
          h: 'CANVAS_HEIGHT',
          visible: true,
        },
        content: backgroundContent,
      },
    ],
    mixer: [
      {
        deviceName: micId,
        audioStream: micContent,
      },
    ],
    update: ({
      cameraContent: _cameraContent,
      cameraId: _cameraId,
      cameraOffContent: _cameraOffContent,
      backgroundContent: _backgroundContent,
      micId: _micId,
      micContent: _micContent,
    }) => {
      const newProps = {
        cameraContent: _cameraContent || cameraContent,
        cameraId: _cameraId || cameraId,
        cameraOffContent: _cameraOffContent || cameraOffContent,
        backgroundContent: _backgroundContent || backgroundContent,
        micContent: _micContent || micContent,
        micId: _micId || micId,
      };
      return VIDEO_TEMPLATE(newProps);
    },
  };
};

export const SCREENSHARE_TEMPLATE = ({
  cameraContent,
  cameraId,
  screenShareContent,
  screenShareId,
  cameraOffContent,
  backgroundContent,
  micContent,
  micId,
  screenAudioContent,
  screenAudioId,
}) => {
  return {
    name: 'screenshareTemplate',
    slots: [
      {
        name: cameraId,
        type: 'video',
        dimensions: {
          x: '20',
          y: 'CANVAS_HEIGHT - LAYER_HEIGHT - 20',
          z: 4,
          w: 'CANVAS_WIDTH * 0.2',
          h: 'CANVAS_HEIGHT * 0.2',
          visible: true,
        },
        content: cameraContent,
      },
      {
        name: screenShareId,
        type: 'device',
        dimensions: {
          x: 0,
          y: 0,
          z: 2,
          w: 'CANVAS_WIDTH',
          h: 'CANVAS_HEIGHT',
          visible: true,
        },
        content: screenShareContent,
      },
      {
        name: 'background',
        type: 'image',
        dimensions: {
          x: 0,
          y: 0,
          z: 0,
          w: 'CANVAS_WIDTH',
          h: 'CANVAS_HEIGHT',
          visible: true,
        },
        content: backgroundContent,
      },
    ],
    mixer: [
      {
        deviceName: micId,
        audioStream: micContent,
      },
      {
        deviceName: screenAudioId,
        audioStream: screenAudioContent,
      },
    ],
    update: ({
      cameraContent: _cameraContent,
      cameraId: _cameraId,
      screenShareContent: _screenShareContent,
      screenShareId: _screenShareId,
      cameraOffContent: _cameraOffContent,
      backgroundContent: _backgroundContent,
      micContent: _micContent,
      micId: _micId,
      screenAudioContent: _screenAudioContent,
      screenAudioId: _screenAudioId,
    }) => {
      const newProps = {
        cameraContent: _cameraContent || cameraContent,
        cameraId: _cameraId || cameraId,
        screenShareContent: _screenShareContent || screenShareContent,
        screenShareId: _screenShareId || screenShareId,
        cameraOffContent: _cameraOffContent || cameraOffContent,
        backgroundContent: _backgroundContent || backgroundContent,
        micId: _micId || micId,
        micContent: _micContent || micContent,
        screenAudioId: _screenAudioId || screenAudioId,
        screenAudioContent: _screenAudioContent || screenAudioContent,
      };
      return SCREENSHARE_TEMPLATE(newProps);
    },
  };
};

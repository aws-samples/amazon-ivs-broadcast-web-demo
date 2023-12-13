export const DEFAULT_TEMPLATE = ({
  cameraContent,
  cameraId,
  cameraVisible = true,
  cameraIsCanvas = false,
  cameraResize = undefined,
  cameraOffContent,
  micMutedContent,
  showMuteIcon = false,
  backgroundContent,
  micId,
  micContent,
}) => {
  return {
    name: 'defaultTemplate',
    slots: [
      {
        name: 'micMutedIcon',
        type: 'image',
        dimensions: {
          x: 'CANVAS_WIDTH - LAYER_WIDTH - LAYER_WIDTH * 0.5',
          y: 'LAYER_WIDTH * 0.5',
          z: 4,
          w: 'CANVAS_HEIGHT * 0.06',
          h: 'CANVAS_HEIGHT * 0.06',
        },
        visible: showMuteIcon,
        content: micMutedContent,
      },
      {
        name: cameraId,
        type: cameraIsCanvas ? 'video' : 'device',
        dimensions: {
          x: 0,
          y: 0,
          z: 2,
          w: 'CANVAS_WIDTH',
          h: 'CANVAS_HEIGHT',
        },
        visible: cameraVisible,
        resize: cameraResize,
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
        },
        visible: true,
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
        },
        visible: true,
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
      cameraVisible: _cameraVisible,
      cameraIsCanvas: _cameraIsCanvas,
      cameraResize: _cameraResize,
      cameraOffContent: _cameraOffContent,
      micMutedContent: _micMutedContent,
      showMuteIcon: _showMuteIcon,
      backgroundContent: _backgroundContent,
      micId: _micId,
      micContent: _micContent,
    }) => {
      const newProps = {
        cameraContent: _cameraContent || cameraContent,
        cameraId: _cameraId || cameraId,
        cameraVisible: _cameraVisible || cameraVisible,
        cameraResize: _cameraResize || cameraResize,
        cameraIsCanvas: _cameraIsCanvas || cameraIsCanvas,
        cameraOffContent: _cameraOffContent || cameraOffContent,
        micMutedContent: _micMutedContent || micMutedContent,
        showMuteIcon: _showMuteIcon || showMuteIcon,
        backgroundContent: _backgroundContent || backgroundContent,
        micContent: _micContent || micContent,
        micId: _micId || micId,
      };
      return DEFAULT_TEMPLATE(newProps);
    },
  };
};

export const SCREENSHARE_TEMPLATE = ({
  cameraContent,
  cameraId,
  cameraVisible = true,
  cameraIsCanvas = false,
  screenShareContent,
  screenShareId,
  cameraOffContent,
  micMutedContent,
  showMuteIcon = false,
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
        name: 'micMutedIcon',
        type: 'image',
        dimensions: {
          x: 'CANVAS_WIDTH - LAYER_WIDTH - LAYER_WIDTH * 0.5',
          y: 'LAYER_WIDTH * 0.5',
          z: 4,
          w: 'CANVAS_HEIGHT * 0.06',
          h: 'CANVAS_HEIGHT * 0.06',
        },
        visible: showMuteIcon,
        content: micMutedContent,
      },
      {
        name: cameraId,
        type: cameraIsCanvas ? 'video' : 'device',
        dimensions: {
          x: '20',
          y: 'CANVAS_HEIGHT - LAYER_HEIGHT - 20',
          z: 4,
          w: 'CANVAS_WIDTH * 0.2',
          h: 'CANVAS_HEIGHT * 0.2',
        },
        visible: cameraVisible,
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
        },
        visible: true,
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
        },
        visible: true,
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
      cameraIsCanvas: _cameraIsCanvas,
      screenShareContent: _screenShareContent,
      screenShareId: _screenShareId,
      cameraOffContent: _cameraOffContent,
      micMutedContent: _micMutedContent,
      showMuteIcon: _showMuteIcon,
      backgroundContent: _backgroundContent,
      micContent: _micContent,
      micId: _micId,
      screenAudioContent: _screenAudioContent,
      screenAudioId: _screenAudioId,
    }) => {
      const newProps = {
        cameraContent: _cameraContent || cameraContent,
        cameraId: _cameraId || cameraId,
        cameraIsCanvas: _cameraIsCanvas || cameraIsCanvas,
        screenShareContent: _screenShareContent || screenShareContent,
        screenShareId: _screenShareId || screenShareId,
        cameraOffContent: _cameraOffContent || cameraOffContent,
        micMutedContent: _micMutedContent || micMutedContent,
        showMuteIcon: _showMuteIcon || showMuteIcon,
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

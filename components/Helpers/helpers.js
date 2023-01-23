function formatConfig(config) {
  const streamConfig = {
    maxResolution: {
      width: config.w,
      height: config.h,
    },
    maxFramerate: 30,
    maxBitrate: config.bitrate,
  };
  return streamConfig;
}

function getConfigFromResolution(resolution, channelType) {
  var config, bitrate;
  switch (resolution) {
    case '1080':
      bitrate = channelType === 'STANDARD' ? 8500 : 3500;
      config = {
        w: 1920,
        h: 1080,
        bitrate: bitrate,
      };
      break;
    case '720':
      bitrate = channelType === 'STANDARD' ? 6500 : 3500;
      config = {
        w: 1280,
        h: 720,
        bitrate: bitrate,
      };
      break;
    case '480':
      bitrate = channelType === 'STANDARD' ? 3500 : 1500;
      config = {
        w: 853,
        h: 480,
        bitrate: bitrate,
      };
      break;
    case '360':
      bitrate = channelType === 'STANDARD' ? 3500 : 1500;
      config = {
        w: 640,
        h: 360,
        bitrate: bitrate,
      };
      break;
    default:
      bitrate = channelType === 'STANDARD' ? 6500 : 3500;
      config = {
        w: 1280,
        h: 720,
        bitrate: bitrate,
      };
      break;
  }
  const streamConfig = formatConfig(config);
  return streamConfig;
}

export { getConfigFromResolution };

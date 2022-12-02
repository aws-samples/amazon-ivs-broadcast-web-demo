import { useState } from 'react';
import { getConfigFromResolution } from '../Helpers';

const useStream = () => {
  const [isLive, setIsLive] = useState(false);
  const [streamLoading, setStreamLoading] = useState(false);

  const startStream = async (
    ingestServer,
    streamKey,
    channelType,
    streamResolution,
    client,
    handleError
  ) => {
    // Set the ingest server to re-validate before attempting to start the stream.
    try {
      client.config.ingestEndpoint = ingestServer;
    } catch (err) {
      // Silently fail here, as ingestEndpoint errors are caught when going live.
      // console.error(err);
    }

    // Get the actual width and height from the selected resolution
    const parsedConfig = getConfigFromResolution(streamResolution, channelType);
    client.config.streamConfig = {
      maxResolution: {
        width: parsedConfig.w,
        height: parsedConfig.h,
      },
      maxFramerate: 30,
      maxBitrate: parsedConfig.bitrate,
    };

    var timer;
    try {
      timer = setTimeout(() => {
        handleError(
          "It's taking longer than ususal to start the stream. Check the status of your internet connection and disable any active VPNs."
        );
        setIsLive(false);
        setStreamLoading(false);
      }, 10000);

      setStreamLoading(true);
      await client.getAudioContext().resume();
      await client.startBroadcast(streamKey);

      clearTimeout(timer);
      setIsLive(true);
      setStreamLoading(false);
    } catch (err) {
      switch (err.code) {
        case 10000:
          handleError(
            `Error starting stream: Your stream settings are misconfigured. The Channel type you selected: ${
              channelType === 'STANDARD' ? 'Standard' : 'Basic'
            }, must match the channel type of your Amazon IVS Channel.`
          );
          break;
        default:
          handleError(`Error starting stream: ${err.message}.`);
          break;
      }
      if (timer) clearTimeout(timer);
      setIsLive(false);
      setStreamLoading(false);
    } finally {
      return;
    }
  };

  const stopStream = async (client, handleError) => {
    try {
      await client.stopBroadcast();
      setIsLive(false);
    } catch (err) {
      handleError(`${err.name}: ${err.message}`);
    } finally {
      return;
    }
  };

  const toggleStream = async (
    ingestServer,
    streamKey,
    channelType,
    streamResolution,
    client,
    handleError
  ) => {
    if (isLive) {
      stopStream(client, handleError);
    } else {
      startStream(
        ingestServer,
        streamKey,
        channelType,
        streamResolution,
        client,
        handleError
      );
    }
  };

  return {
    isLive,
    streamLoading,
    toggleStream,
  };
};

export default useStream;

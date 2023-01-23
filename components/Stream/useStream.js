import { useState } from 'react';
import { getConfigFromResolution } from '../Helpers';

const useStream = () => {
  const [isLive, setIsLive] = useState(false);
  const [streamLoading, setStreamLoading] = useState(false);

  const startStream = async (
    ingestServer,
    streamKey,
    channelType,
    client,
    handleError
  ) => {
    var timer;
    try {
      // Set the ingest server to re-validate it before attempting to start the stream.
      client.config.ingestEndpoint = ingestServer;

      // Set a timeout on the stream to show an alert if the stream is taking longer than intended to start.
      timer = setTimeout(() => {
        handleError(
          "It's taking longer than ususal to start the stream. Check the status of your internet connection and disable any active VPNs."
        );
        setIsLive(false);
        setStreamLoading(false);
      }, 10000);

      setStreamLoading(true);

      // Resume the audio context to prevent audio issues when starting a stream after idling on the page
      // in some browsers.
      await client.getAudioContext().resume();
      await client.startBroadcast(streamKey);

      clearTimeout(timer);
      setIsLive(true);
      setStreamLoading(false);
    } catch (err) {
      switch (err.code) {
        case 10000:
          handleError(
            `Error starting stream: Your stream settings are misconfigured. This is likely caused by mismatched channel types. The Channel type you selected: ${
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
    client,
    handleError
  ) => {
    if (isLive) {
      stopStream(client, handleError);
    } else {
      startStream(ingestServer, streamKey, channelType, client, handleError);
    }
  };

  return {
    isLive,
    streamLoading,
    toggleStream,
  };
};

export default useStream;

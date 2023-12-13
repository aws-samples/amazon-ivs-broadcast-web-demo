import Button from '@/components/Button';
import Settings from '@/components/Settings';
import { ModalContext } from '@/providers/ModalContext';
import { UserSettingsContext } from '@/providers/UserSettingsContext';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const useBroadcastSDK = () => {
  const { streamKey, ingestEndpoint } = useContext(UserSettingsContext);
  const { toggleModal, setModalProps, setModalContent } =
    useContext(ModalContext);

  const [broadcastClientMounted, setBroadcastClientMounted] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [streamPending, setStreamPending] = useState(false);
  const [connectionState, setConnectionState] = useState();
  const [clientErrors, setClientErrors] = useState([]);
  const IVSBroadcastClientRef = useRef(undefined);
  const broadcastClientRef = useRef(undefined);
  const broadcastClientEventsRef = useRef(undefined);
  const startTimeRef = useRef(undefined);
  const sdkVersionRef = useRef(undefined);

  const importBroadcastSDK = async () => {
    const sdk = (await import('amazon-ivs-web-broadcast')).default;
    broadcastClientEventsRef.current = sdk.BroadcastClientEvents;
    IVSBroadcastClientRef.current = sdk;
    return sdk;
  };

  const createBroadcastClient = async ({ config: streamConfig }) => {
    const IVSBroadcastClient = IVSBroadcastClientRef.current
      ? IVSBroadcastClientRef.current
      : await importBroadcastSDK();

    const client = IVSBroadcastClient.create({
      streamConfig,
    });

    broadcastClientRef.current = client;
    sdkVersionRef.current = IVSBroadcastClient.__version;
    setIsSupported(IVSBroadcastClient.isSupported());
    attachBroadcastClientListeners(client);

    // Hack to get fix react state update issue
    setBroadcastClientMounted(new Date());

    return client;
  };

  const destroyBroadcastClient = (client) => {
    detachBroadcastClientListeners(client);
    client.delete();
    setBroadcastClientMounted(false);
  };

  const attachBroadcastClientListeners = (client) => {
    client.on(
      broadcastClientEventsRef.current.CONNECTION_STATE_CHANGE,
      handleConnectionStateChange
    );
    client.on(
      broadcastClientEventsRef.current.ACTIVE_STATE_CHANGE,
      handleActiveStateChange
    );
    client.on(broadcastClientEventsRef.current.ERROR, handleClientError);
  };

  const detachBroadcastClientListeners = (client) => {
    client.off(
      broadcastClientEventsRef.current.CONNECTION_STATE_CHANGE,
      handleConnectionStateChange
    );
    client.off(
      broadcastClientEventsRef.current.ACTIVE_STATE_CHANGE,
      handleActiveStateChange
    );
    client.off(broadcastClientEventsRef.current.ERROR, handleClientError);
  };

  const restartBroadcastClient = async ({ config, ingestEndpoint }) => {
    if (isLive) stopStream(broadcastClientRef.current);
    destroyBroadcastClient(broadcastClientRef.current);

    const newClient = await createBroadcastClient({
      config,
      ingestEndpoint,
    });

    return newClient;
  };

  const handleActiveStateChange = (active) => {
    setIsLive(active);
  };

  const handleConnectionStateChange = (state) => {
    setConnectionState(state);
  };

  const handleClientError = (clientError) => {
    setClientErrors((prevState) => [...prevState, clientError]);
  };

  const stopStream = async (client) => {
    try {
      setStreamPending(true);
      toast.loading('Stopping stream...', { id: 'STREAM_STATUS' });
      await client.stopBroadcast();
      startTimeRef.current = undefined;
      toast.success('Stopped stream', { id: 'STREAM_STATUS' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to stop stream', {
        id: 'STREAM_STATUS',
      });
    } finally {
      setStreamPending(false);
      toast.remove('STREAM_TIMEOUT');
    }
  };

  const startStream = async ({ client, streamKey, ingestEndpoint }) => {
    var streamTimeout;

    try {
      toast.loading(
        (t) => {
          return (
            <span>
              <span className='pr-4'>Starting stream...</span>
              <Button
                type='toast'
                onClick={() => {
                  toast.dismiss(t.id);
                  stopStream(client);
                }}
              >
                Stop
              </Button>
            </span>
          );
        },
        { id: 'STREAM_STATUS' }
      );
      setStreamPending(true);

      streamTimeout = setTimeout(() => {
        toast(
          (t) => {
            return (
              <span className='text-black/50'>
                It's taking longer than usual to start the stream. If you are on
                a VPN, check if port 4443 is unblocked and try again.
              </span>
            );
          },
          { id: 'STREAM_TIMEOUT', duration: Infinity, icon: '⚠️' }
        );
      }, 5000);

      await client.startBroadcast(streamKey, ingestEndpoint);
      clearTimeout(streamTimeout);
      startTimeRef.current = new Date();
      toast.success('Started stream.', { id: 'STREAM_STATUS' });
    } catch (err) {
      clearTimeout(streamTimeout);
      console.error(err);

      if (err.code === 18000) {
        // Stream key invalid error
        // See: https://aws.github.io/amazon-ivs-web-broadcast/docs/v1.3.1/sdk-reference/namespaces/Errors?_highlight=streamkeyinvalidcharerror#stream_key_invalid_char_error
        toast(
          (t) => {
            return (
              <div className='flex items-center'>
                <span className='pr-4 grow'>
                  <strong>Invalid stream key.</strong> Enter a valid stream key
                  to continue.
                </span>
                <span className='shrink-0'>
                  <Button
                    type='toast'
                    onClick={() => {
                      toast.dismiss(t.id);
                      setModalProps({
                        type: 'full',
                      });
                      setModalContent(<Settings />);
                      toggleModal();
                    }}
                  >
                    Open settings
                  </Button>
                </span>
              </div>
            );
          },
          {
            id: 'STREAM_STATUS',
            position: 'bottom-center',
            duration: Infinity,
            style: {
              minWidth: '24rem',
              width: '100%',
            },
          }
        );
      } else {
        toast.error('Failed to start stream', {
          id: 'STREAM_STATUS',
        });
      }
    } finally {
      toast.remove('STREAM_TIMEOUT');
      setStreamPending(false);
    }
  };

  const toggleStream = async () => {
    if (isLive) {
      await stopStream(broadcastClientRef.current);
    } else {
      await startStream({
        client: broadcastClientRef.current,
        streamKey,
        ingestEndpoint,
      });
    }
  };

  return {
    IVSBroadcastClientRef,
    sdkVersionRef,
    broadcastClientMounted,
    broadcastClientRef,
    connectionState,
    isLive,
    isSupported,
    streamPending,
    broadcastStartTimeRef: startTimeRef,
    broadcastErrors: clientErrors,
    toggleStream,
    stopStream,
    startStream,
    createBroadcastClient,
    destroyBroadcastClient,
    restartBroadcastClient,
  };
};

export default useBroadcastSDK;

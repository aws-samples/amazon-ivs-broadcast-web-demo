import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import ToasterBar from '@/components/ToasterBar';
import StatusBar from '@/components/StatusBar';
import StreamPreview from '@/components/StreamPreview';
import ControlBar from '@/components/ControlBar';
import { ModalContext } from '@/providers/ModalContext';
import { BroadcastContext } from '@/providers/BroadcastContext';
import Modal from '@/components/Modal';
import { UserSettingsContext } from '@/providers/UserSettingsContext';
import { BroadcastLayoutContext } from '@/providers/BroadcastLayoutContext';
import { LocalMediaContext } from '@/providers/LocalMediaContext';
import CameraCanvas from '@/components/CameraCanvas/CameraCanvas';
import { useAuth } from '@/providers/AuthContext';
import Button from '@/components/Button';
import toast from 'react-hot-toast';
import Head from 'next/head';

export default function BroadcastApp() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { logout, user } = useAuth();

  const { toggleModal, modalProps, modalActive, modalContent } =
    useContext(ModalContext);
  const { showFullScreenCam, refreshCurrentScene } = useContext(
    BroadcastLayoutContext
  );
  const {
    isLive,
    isSupported,
    broadcastClientRef,
    createBroadcastClient,
    destroyBroadcastClient,
    broadcastClientMounted,
  } = useContext(BroadcastContext);
  const { configRef, ingestEndpoint, setIngestEndpoint, setStreamKey } =
    useContext(UserSettingsContext);
  const {
    setInitialDevices,
    localVideoDeviceId,
    localVideoStreamRef,
    canvasElemRef,
    cleanUpDevices,
    enableCanvasCamera,
    refreshSceneRef,
  } = useContext(LocalMediaContext);

  const previewRef = useRef(undefined);
  const sdkIsStarting = useRef(false);
  const [canvasWidth, setCanvasWidth] = useState();
  const [canvasHeight, setCanvasHeight] = useState();
  const [videoStream, setVideoStream] = useState();
  const [broadcastName, setBroadcastName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateChannel = async () => {
    if (!broadcastName) return;
    setIsCreating(true);
    const toastId = toast.loading('Creating Channel...');
    try {
      const res = await fetch('/api/createChannel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ broadcastName }),
      });
      const data = await res.json();
      if (data.success) {
        setIngestEndpoint(data.ingestEndpoint);
        setStreamKey(data.streamKey);
        toast.success(`Channel "${data.channelName}" created!`, { id: toastId });
      } else {
        toast.error('Failed to create channel: ' + data.message, { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error creating channel', { id: toastId });
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (sdkIsStarting.current) return;
    sdkIsStarting.current = true;
    setInitialDevices().then(
      ({ audioDeviceId, audioStream, videoDeviceId, videoStream }) => {
        if (!broadcastClientRef.current) {
          createBroadcastClient({
            config: configRef.current,
          })
            .then((client) => {
              const { width, height } = videoStream
                .getTracks()[0]
                .getSettings();
              refreshSceneRef.current = refreshCurrentScene;
              showFullScreenCam({
                cameraStream: enableCanvasCamera
                  ? canvasElemRef.current
                  : videoStream,
                cameraId: videoDeviceId,
                cameraIsCanvas: enableCanvasCamera,
                micStream: audioStream,
                micId: audioDeviceId,
                showMuteIcon: false,
              });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    );
    return () => {
      if (broadcastClientRef.current)
        destroyBroadcastClient(broadcastClientRef.current);
      cleanUpDevices();
    };
    // run once on mount
  }, []);

  useEffect(() => {
    const uidQuery = searchParams.get('uid');
    const skQuery = searchParams.get('sk');
    const channelTypeQuery = searchParams.get('channelType');

    if (uidQuery)
      setIngestEndpoint(`${uidQuery}.global-contribute.live-video.net`);
    if (skQuery) setStreamKey(skQuery);
    if (channelTypeQuery) {
      const formatted = channelType.toUpperCase();
      switch (formatted) {
        case 'BASIC':
          setChannelType('BASIC');
          break;
        case 'STANDARD':
          setChannelType('STANDARD');
        default:
          console.error(
            `Channel type must be STANDARD, BASIC. The channel type you provided is ${channelType}. The default value of BASIC has been set`
          );
          break;
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (broadcastClientMounted)
      broadcastClientRef.current.attachPreview(previewRef.current);
    return () => {
      if (broadcastClientRef.current)
        broadcastClientRef.current.detachPreview();
    };
  }, [broadcastClientMounted]);

  // React to webcam device changes if the canvas camera is enabled.
  useEffect(() => {
    if (!broadcastClientMounted || !enableCanvasCamera) return;
    const { width, height } = broadcastClientRef.current.getCanvasDimensions();
    setCanvasWidth(width);
    setCanvasHeight(height);
    setVideoStream(localVideoStreamRef.current);
  }, [localVideoDeviceId, broadcastClientMounted, enableCanvasCamera]);

  useEffect(() => {
    if (!isSupported) {
      toast.error(
        (t) => {
          return (
            <div className='flex items-center'>
              <span className='pr-4 grow'>
                This browser is not fully supported. Certain features may not
                work as expected.{' '}
                <a
                  href='https://docs.aws.amazon.com/ivs/latest/LowLatencyUserGuide/broadcast.html#broadcast-platform-requirements'
                  target='_blank'
                  rel='noreferrer noopener'
                  className='text-primaryAlt dark-theme:text-primary hover:text-primary hover:dark-theme:text-primaryAlt hover:underline underline-offset-1'
                >
                  Learn more
                </a>
              </span>
            </div>
          );
        },
        {
          id: 'BROWSER_SUPPORT',
          duration: Infinity,
        }
      );
    }
  }, [isSupported]);

  const title = `Amazon IVS – Web Broadcast Tool - ${isLive ? 'LIVE' : 'Offline'
    }`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className='flex flex-col h-[100dvh] items-center bg-surface'>
        <div className="w-full p-4 bg-surface flex gap-2 justify-between items-center z-10 border-b border-gray-700">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Enter Broadcast Name"
              className="p-2 rounded text-black w-64"
              value={broadcastName}
              onChange={(e) => setBroadcastName(e.target.value)}
            />
            <button
              onClick={handleCreateChannel}
              disabled={isCreating || !broadcastName}
              className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50 font-bold hover:bg-primaryAlt transition-colors"
            >
              {isCreating ? 'Creating...' : 'Create Channel'}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-nyu-neutral-600">Welcome, {user?.username}</span>
            <Button 
              type="secondary" 
              onClick={async () => {
                await logout();
                router.push('/');
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
        <ToasterBar />
        <StatusBar />
        <StreamPreview previewRef={previewRef} />
        <ControlBar />
        {enableCanvasCamera && (
          <CameraCanvas
            width={canvasWidth}
            height={canvasHeight}
            videoStream={videoStream}
          />
        )}
      </div>
      <Modal show={modalActive} onClose={toggleModal} {...modalProps}>
        {modalContent}
      </Modal>
    </>
  );
}

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
import toast from 'react-hot-toast';

export default function BroadcastApp() {
  const searchParams = useSearchParams();

  const { toggleModal, modalProps, modalActive, modalContent } =
    useContext(ModalContext);
  const { showFullScreenCam } = useContext(BroadcastLayoutContext);
  const {
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
  } = useContext(LocalMediaContext);

  const previewRef = useRef(undefined);
  const sdkIsStarting = useRef(false);
  const [canvasWidth, setCanvasWidth] = useState();
  const [canvasHeight, setCanvasHeight] = useState();
  const [videoStream, setVideoStream] = useState();

  useEffect(() => {
    if (sdkIsStarting.current) return;
    sdkIsStarting.current = true;
    setInitialDevices().then(
      ({ audioDeviceId, audioStream, videoDeviceId, videoStream }) => {
        if (!broadcastClientRef.current) {
          createBroadcastClient({
            config: configRef.current,
          }).then((client) => {
            const { width, height } = videoStream.getTracks()[0].getSettings();
            showFullScreenCam({
              cameraStream: enableCanvasCamera
                ? canvasElemRef.current
                : videoStream,
              cameraId: videoDeviceId,
              cameraIsCanvas: enableCanvasCamera,
              micStream: audioStream,
              micId: audioDeviceId,
            });
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

  useEffect(() => {
    if (!broadcastClientMounted) return;
    const { width, height } = broadcastClientRef.current.getCanvasDimensions();
    setCanvasWidth(width);
    setCanvasHeight(height);
    setVideoStream(localVideoStreamRef.current);
  }, [localVideoDeviceId, broadcastClientMounted]);

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
                  href=''
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

  return (
    <>
      <div className='flex flex-col h-[100dvh] items-center bg-surface'>
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

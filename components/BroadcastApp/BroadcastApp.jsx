import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ToastBar from '@/components/ToastBar';
import StatusBar from '@/components/StatusBar';
import StreamPreview from '@/components/StreamPreview';
import ControlBar from '@/components/ControlBar';
import { ModalContext } from '@/providers/ModalContext';
import { BroadcastContext } from '@/providers/BroadcastContext';
import Modal from '@/components/Modal';
import { UserSettingsContext } from '@/providers/UserSettingsContext';
import { BroadcastLayoutContext } from '@/providers/BroadcastLayoutContext';
import { LocalMediaContext } from '@/providers/LocalMediaContext';
import CameraCanvas from '../CameraCanvas/CameraCanvas';

export default function BroadcastApp() {
  const searchParams = useSearchParams();

  const { toggleModal, modalProps, modalActive, modalContent } =
    useContext(ModalContext);
  const { showFullScreenCam } = useContext(BroadcastLayoutContext);
  const {
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
            ingestEndpoint,
          }).then((client) => {
            showFullScreenCam({
              cameraStream: canvasElemRef.current,
              cameraId: videoDeviceId,
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

  return (
    <>
      <div className='flex flex-col h-[100dvh] items-center bg-surface'>
        <ToastBar />
        <StatusBar />
        <StreamPreview previewRef={previewRef} />
        <ControlBar />
        <CameraCanvas
          width={canvasWidth}
          height={canvasHeight}
          videoStream={videoStream}
        />
      </div>
      <Modal show={modalActive} onClose={toggleModal} {...modalProps}>
        {modalContent}
      </Modal>
    </>
  );
}

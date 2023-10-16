import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { isDesktop, isChrome, isFirefox } from 'react-device-detect';

import StatusBar from '../components/StatusBar';
import StreamPreview, {
  useLayers,
  useMixer,
} from '../components/StreamPreview';
import useScreenShare from '../components/ScreenShare';
import ControlBar from '../components/ControlBar';

import styles from '../styles/Broadcast.module.css';
import Modal, { useModal } from '../components/Modal';
import Settings from '../components/Settings';
import Button from '../components/Button';
import Icon from '../components/Icon';
import About from '../components/About';
import Tooltip from '../components/Tooltip';
import AlertBar from '../components/AlertBar';
import AlertBox, { useAlertBox } from '../components/AlertBox';

import { getConfigFromResolution } from '../components/Helpers';
import useStream from '../components/Stream';

const CAM_LAYER_NAME = 'camera';
const MIC_LAYER_NAME = 'mic';

export default function Broadcast() {
  const client = useRef(null);
  const canvasRef = useRef(null);
  const channelType = useRef('STANDARD');

  // By default, initialize the stream canvas at 720p resolution.
  // Higher resolutions (like 1920x1080) may result in poor performance on some devices.
  const streamResolution = useRef('720');

  const [devicePermissions, setDevicePermissions] = useState({
    video: false,
    audio: false,
  });

  const { updateLayer, addLayer, removeLayer, resetLayers } = useLayers([]);

  const {
    addMixerDevice,
    addAudioTrack,
    removeMixerDevice,
    toggleMixerDeviceMute,
    resetMixer,
  } = useMixer([]);

  const { captureStream, startScreenShare, stopScreenShare } = useScreenShare();

  const { isLive, streamLoading, toggleStream } = useStream();

  const [ingestServer, setIngestServer] = useState('');
  const [streamKey, setStreamKey] = useState('');
  const [rememberSettings, setRememberSettings] = useState(false);

  const [videoDevices, setVideoDevices] = useState(null);
  const [audioDevices, setAudioDevices] = useState(null);

  const activeVideoDevice = useRef(null);
  const activeAudioDevice = useRef(null);

  const [camMuted, setCamMuted] = useState(false);
  const [micMuted, setMicMuted] = useState(false);

  const [settingsModalActive, toggleSettingsModal] = useModal();
  const [aboutModalActive, toggleAboutModal] = useModal();

  const [errorAlertActive, toggleErrorAlert] = useAlertBox();
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const [version, setVersion] = useState();

  // Router is used to check for URL parameters
  // For example the stream key, ingest server, and channel type can be
  // prepopulated with the following URL parameters
  // <baseUrl>/?uid=abc123def456&sk=sk_us-west-2_123456789012_aaaaaaaaaaaaaaaaa&channelType=BASIC
  const router = useRouter();

  // This tool is only tested on desktop version of Firefox and Chrome
  // Other browsers, such as Safari, or mobile versions of Chrome or Firefox
  // may work, but are not fully supported.
  const isSupported = isDesktop && (isFirefox || isChrome);
  const [showAlert, setShowAlert] = useState(!isSupported);
  const title = `Amazon IVS – Web Broadcast Tool - ${
    isLive ? 'LIVE' : 'Offline'
  }`;

  const handleError = (message) => {
    toggleErrorAlert();
    setErrorAlertMessage(`${message}`);
    console.error(message);
  };

  const handlePermissions = async () => {
    try {
      // See useLayers.js > addVideoLayer() to modify the requested webcam resolution
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      for (const track of stream.getTracks()) {
        track.stop();
      }
      setDevicePermissions({ video: true, audio: true });
    } catch (err) {
      setDevicePermissions({ video: false, audio: false });
      throw Error(err);
    }
  };

  const handleStream = async () => {
    if (ingestServer && streamKey) {
      toggleStream(
        ingestServer,
        streamKey,
        channelType.current,
        client.current,
        handleError
      );
    } else {
      handleSettings();
    }
  };

  const handleMicMute = async () => {
    const mixerDevice = {
      name: MIC_LAYER_NAME,
      device: activeAudioDevice.current,
      muted: micMuted,
    };

    const muted = toggleMixerDeviceMute(mixerDevice, client.current);
    setMicMuted(muted);
  };

  const handleCameraMute = async () => {
    const canvas = client.current.getCanvasDimensions();

    let camLayer = {
      device: activeVideoDevice.current,
      name: CAM_LAYER_NAME,
      index: 4,
      visible: camMuted,
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
      type: 'VIDEO',
    };

    // captureStream?.active will be truthy if screensharing is active.
    if (captureStream?.active) {
      const padding = 20;
      camLayer = {
        ...camLayer,
        x: canvas.width - canvas.width / 4 - padding,
        y: canvas.height - canvas.height / 4 - padding,
        width: canvas.width / 4,
        height: canvas.height / 4,
        type: 'VIDEO',
      };
    }

    if (camMuted) {
      await addLayer(camLayer, client.current);
      setCamMuted(false);
    } else {
      await removeLayer(camLayer, client.current);
      setCamMuted(true);
    }
  };

  const handleSettings = async () => {
    if (!settingsModalActive) {
      // Refresh video devices
      const vd = await getVideoDevices(client.current);
      setVideoDevices(vd);
      // Refresh audio devices
      const ad = await getAudioDevices(client.current);
      setAudioDevices(ad);
    }
    toggleSettingsModal();
  };

  const handleScreenShare = async () => {
    // If the SDK client is not available, throw an error
    if (!client.current) {
      handleError(`Screen share error: Broadcast SDK is not available.`);
      return;
    }

    const canvas = client.current.getCanvasDimensions();

    // Toggle the state of the active screen share
    try {
      if (captureStream?.active) {
        await stopScreenShare(
          activeVideoDevice.current,
          camMuted,
          removeLayer,
          removeMixerDevice,
          updateLayer,
          client.current
        );
      } else {
        await startScreenShare(
          activeVideoDevice.current,
          camMuted,
          updateLayer,
          addLayer,
          removeLayer,
          removeMixerDevice,
          addAudioTrack,
          canvas,
          client.current
        );
      }
    } catch (err) {
      handleError(`Screen share error: ${err.message}`);
    }
  };

  const getVideoDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );
      if (!videoDevices.length) {
        throw Error('No video devices found.');
      }
      return videoDevices;
    } catch (err) {
      throw Error(err);
    }
  };

  const getAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(
        (device) => device.kind === 'audioinput'
      );
      if (!audioDevices.length) {
        throw Error('No audio devices found.');
      }
      return audioDevices;
    } catch (err) {
      throw Error(err);
    }
  };

  // Initialize canvas layers...
  const initLayers = async () => {
    // If the user has not provided permissions, get them.
    if (!devicePermissions.video) {
      try {
        await handlePermissions();
      } catch (err) {
        // If we still don't have permissions after requesting them display the error message
        if (!devicePermissions.video && !devicePermissions.audio) {
          handleError(
            'Failed to access the camera and microphone. To start streaming, you must allow access to both your camera and microphone'
          );
        }
      }
    }

    // Log errors in the browser console
    client.current.config.logLevel = client.current.config.LOG_LEVEL.ERROR;

    // Attach the preview canvas to the client
    client.current.attachPreview(canvasRef.current);

    const canvas = client.current.getCanvasDimensions();
    const camOffLayer = {
      name: 'camOff',
      imageSrc: '/assets/camera-off.png',
      index: 1,
      x: canvas.width / 2 - canvas.width / 16,
      y: canvas.height / 2 - canvas.width / 16,
      width: canvas.width / 8,
      height: canvas.width / 8,
      type: 'IMAGE',
    };

    try {
      await addLayer(camOffLayer, client.current);
    } catch (err) {
      handleError(
        'Error: Failed to add a layer to the canvas. If the problem persists, try refreshing the app.'
      );
    }

    try {
      // Get video devices
      var vd = await getVideoDevices(client.current);
      setVideoDevices(vd);

      // Get audio devices
      var ad = await getAudioDevices(client.current);
      setAudioDevices(ad);
    } catch (err) {
      console.error(err);
      handleError(
        'Error: Could not find any available video or audio devices. Please ensure that a camera or microphone is attached to your device, and your privacy settings allow this app access them.'
      );
    }

    // Fetch saved devices from localstorage
    const savedVideoDeviceId = localStorage.getItem('savedVideoDeviceId');
    const savedAudioDeviceId = localStorage.getItem('savedAudioDeviceId');
    try {
      // If there is not active video device, set the default video device as the active device
      if (!activeVideoDevice.current) {
        const savedVideoDevice = vd.find(
          (device) => device.deviceId === savedVideoDeviceId
        );
        activeVideoDevice.current = savedVideoDevice ? savedVideoDevice : vd[0];
      }
      // Render the video device on the broadcast canvas
      renderActiveVideoDevice();

      // If there is no active audio device, set the default audio device as the active device
      if (!activeAudioDevice.current) {
        const savedAudioDevice = ad.find(
          (device) => device.deviceId === savedAudioDeviceId
        );
        activeAudioDevice.current = savedAudioDevice ? savedAudioDevice : ad[0];
      }
      // Add the active audio device to the broadcast mixer
      renderActiveAudioDevice();
    } catch (err) {
      console.error(err);
      handleError(
        'Error: Could not add the selected audio and video devices to the canvas. Please check the app settings to ensure that the correct webcam and microphone are selected.'
      );
    }
  };

  // Handle active video device (webcam) changes...
  const renderActiveVideoDevice = () => {
    const canvas = client.current.getCanvasDimensions();
    const deviceToAdd = activeVideoDevice.current;

    let layer = {
      device: deviceToAdd,
      name: CAM_LAYER_NAME,
      index: 4,
      visible: !camMuted,
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
      type: 'VIDEO',
    };

    // captureStream?.active is truthy if a screenshare is active.
    if (captureStream?.active) {
      const padding = 20;
      layer = {
        ...layer,
        x: canvas.width - canvas.width / 4 - padding,
        y: canvas.height - canvas.height / 4 - padding,
        width: canvas.width / 4,
        height: canvas.height / 4,
        type: 'VIDEO',
      };
    }

    addLayer(layer, client.current);
  };

  // Handle microphone device changes
  const renderActiveAudioDevice = () => {
    const mixerDevice = {
      name: MIC_LAYER_NAME,
      device: activeAudioDevice.current,
      muted: micMuted || false,
    };
    addMixerDevice(mixerDevice, client.current);
  };

  const refreshClient = async () => {
    if (!client.current) return;
    if (isLive) return;

    const updateClientConfig = async () => {
      client.current.detachPreview();

      await resetLayers(client.current);
      await resetMixer(client.current);

      const streamConfig = getConfigFromResolution(
        streamResolution.current,
        channelType.current
      );

      // Set the streamConfig to the new one, with updated resolution.
      client.current.config.streamConfig = streamConfig;

      await initLayers();
    };

    // captureStream?.active is truthy when screensharing
    if (captureStream?.active) {
      try {
        await stopScreenShare(
          activeVideoDevice.current,
          camMuted,
          removeLayer,
          removeMixerDevice,
          updateLayer,
          client.current
        );
        await updateClientConfig();
      } catch (err) {
        handleError(`Screen share error: ${err.message}`);
      }
    } else {
      await updateClientConfig();
    }
  };

  // Runs once on mount
  useEffect(() => {
    // Workaround related to NextJS
    if (typeof window === 'undefined') {
      return;
    }

    // Handle Localstorage
    if (localStorage) {
      const sk = localStorage.getItem('sk');
      const ingestEndpoint = localStorage.getItem('ingestEndpoint');
      const savedChannelType = localStorage.getItem('channelType');
      let savedResolution = localStorage.getItem('streamResolution');
      const persistSettings = localStorage.getItem('rememberSettings');

      // Handles an edge-case when upgrading from
      // previous versions of the streaming tool
      if (savedResolution === '[object Object]') {
        savedResolution = '720';
      }

      if (sk) setStreamKey(sk);
      if (ingestEndpoint) setIngestServer(ingestEndpoint);
      if (savedChannelType) channelType.current = savedChannelType;
      if (savedResolution) streamResolution.current = savedResolution;
      if (persistSettings) setRememberSettings(persistSettings);
    }
  }, []);

  // Handle URL Parameters
  useEffect(() => {
    const { uid, sk, channelType } = router.query;
    if (uid) {
      setIngestServer(`${uid}.global-contribute.live-video.net`);
    }
    if (sk) {
      setStreamKey(`${sk}`);
    }
    if (channelType) {
      const formatted = channelType.toUpperCase();
      switch (formatted) {
        case 'BASIC':
          setChannelType('BASIC');
          break;
        case 'BASIC_FHD':
          setChannelType('BASIC_FHD');
          break;
        case 'STANDARD':
          setChannelType('STANDARD');
        default:
          console.error(
            `Channel type must be STANDARD, BASIC, or BASIC_FHD. The channel type you provided is ${channelType}. The default value of STANDARD has been set`
          );
          setChannelType('STANDARD');
          break;
      }
    }
  }, [router.query]);

  return (
    <>
      <div className={styles.broadcastWrapper}>
        <Head>
          <title>{title}</title>
          <meta
            name='description'
            content='This tool can be used to stream your webcam and share your screen to an Amazon IVS Channel.'
          />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <Script
          src='https://web-broadcast.live-video.net/1.6.0/amazon-ivs-web-broadcast.js'
          strategy='afterInteractive'
          onLoad={() => {
            const streamConfig = getConfigFromResolution(
              streamResolution.current,
              channelType.current
            );
            const IVSClient = IVSBroadcastClient.create({
              streamConfig: streamConfig,
            });
            client.current = IVSClient;
            setVersion(IVSBroadcastClient.__version);
            initLayers();
          }}
        />
        <AlertBar
          handleClose={() => {
            setShowAlert(false);
          }}
          show={showAlert}
          message={
            'This browser is not fully supported by this tool. For best results, open this page on a PC or Mac in Google Chrome or Firefox.'
          }
        />
        <div className={styles.statusBar}>
          <StatusBar
            isLive={isLive}
            streamResolution={streamResolution.current}
          />
        </div>
        <div className={styles.streamPreview}>
          <StreamPreview
            canvasRef={canvasRef}
            videoPermissions={devicePermissions.video}
          />
        </div>
        <div className={styles.controlBar}>
          <div className={styles.controlBarLeft}></div>
          <div className={styles.controlBarCenter}>
            <ControlBar
              videoPermissions={devicePermissions.video}
              isLive={isLive}
              streamLoading={streamLoading}
              isDesktop={isDesktop}
              micMuted={micMuted}
              camMuted={camMuted}
              screenShareActive={captureStream?.active}
              handleScreenShare={handleScreenShare}
              handleSettings={handleSettings}
              handleMicMute={handleMicMute}
              handleCameraMute={handleCameraMute}
              handleStream={handleStream}
              handleAboutClick={toggleAboutModal}
            />
          </div>
          <div className={styles.controlBarRight}>
            <Tooltip hAlign='right' content='About this tool'>
              <Button type={'base'} style='round' onClick={toggleAboutModal}>
                <Icon>
                  <svg
                    width='48'
                    height='48'
                    viewBox='0 0 48 48'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M24.15 34q.65 0 1.075-.425.425-.425.425-1.075v-9.05q0-.6-.45-1.025Q24.75 22 24.15 22q-.65 0-1.075.425-.425.425-.425 1.075v9.05q0 .6.45 1.025.45.425 1.05.425ZM24 18.3q.7 0 1.175-.45.475-.45.475-1.15t-.475-1.2Q24.7 15 24 15q-.7 0-1.175.5-.475.5-.475 1.2t.475 1.15q.475.45 1.175.45ZM24 44q-4.25 0-7.9-1.525-3.65-1.525-6.35-4.225-2.7-2.7-4.225-6.35Q4 28.25 4 24q0-4.2 1.525-7.85Q7.05 12.5 9.75 9.8q2.7-2.7 6.35-4.25Q19.75 4 24 4q4.2 0 7.85 1.55Q35.5 7.1 38.2 9.8q2.7 2.7 4.25 6.35Q44 19.8 44 24q0 4.25-1.55 7.9-1.55 3.65-4.25 6.35-2.7 2.7-6.35 4.225Q28.2 44 24 44Zm0-20Zm0 17q7 0 12-5t5-12q0-7-5-12T24 7q-7 0-12 5T7 24q0 7 5 12t12 5Z' />
                  </svg>
                </Icon>
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <AlertBox type='error' show={errorAlertActive} onClose={toggleErrorAlert}>
        {errorAlertMessage}
      </AlertBox>
      <Modal show={aboutModalActive} onClose={toggleAboutModal}>
        <About version={version} handleModalClose={toggleAboutModal} />
      </Modal>
      <Modal
        type={'full'}
        show={settingsModalActive}
        onClose={toggleSettingsModal}
      >
        <Settings
          client={client.current}
          isSupported={isSupported}
          isLive={isLive}
          defaultChannelType={channelType.current}
          defaultIngestServer={ingestServer}
          defaultStreamKey={streamKey}
          defaultRemember={rememberSettings}
          defaultResolution={streamResolution.current}
          videoDevices={videoDevices}
          audioDevices={audioDevices}
          activeVideoDeviceId={
            activeVideoDevice.current ? activeVideoDevice.current.deviceId : ''
          }
          activeAudioDeviceId={
            activeAudioDevice.current ? activeAudioDevice.current.deviceId : ''
          }
          handleVideoDeviceSelect={(deviceId, clientUpdateRequired) => {
            const device = videoDevices.find(
              (device) => device.deviceId === deviceId
            );
            activeVideoDevice.current = device;
            if (!clientUpdateRequired) renderActiveVideoDevice();
          }}
          handleAudioDeviceSelect={(deviceId, clientUpdateRequired) => {
            const device = audioDevices.find(
              (device) => device.deviceId === deviceId
            );
            activeAudioDevice.current = device;
            if (!clientUpdateRequired) renderActiveAudioDevice();
          }}
          handleChannelTypeChange={(channel) => {
            channelType.current = channel;
          }}
          handleResolutionChange={(resolution) => {
            streamResolution.current = resolution;
          }}
          handleIngestChange={(server) => {
            setIngestServer(server);
          }}
          handleKeyChange={(key) => {
            setStreamKey(key);
          }}
          handleClientRefresh={refreshClient}
          handleModalClose={toggleSettingsModal}
        />
      </Modal>
    </>
  );
}

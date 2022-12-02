import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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

// TODO: Move to constants
const CAM_LAYER_NAME = 'camera';
const MIC_LAYER_NAME = 'mic';

export default function Broadcast() {
  const [client, setClient] = useState(null);
  const [prevClient, setPrevClient] = useState(null);
  const [channelType, setChannelType] = useState('STANDARD');
  const [streamResolution, setStreamResolution] = useState('720');
  const [devicePermissions, setDevicePermissions] = useState({
    video: false,
    audio: false,
  });

  const { updateLayer, addLayer, removeLayer, resetLayers } = useLayers([], {
    width: 1280,
    height: 720,
  });

  const {
    addMixerDevice,
    addAudioTrack,
    removeMixerDevice,
    toggleMixerDeviceMute,
  } = useMixer([]);

  const { captureStream, startScreenShare, stopScreenShare } = useScreenShare({
    width: 1280,
    height: 720,
  });

  const { isLive, streamLoading, toggleStream } = useStream();

  const [ingestServer, setIngestServer] = useState('');
  const [streamKey, setStreamKey] = useState('');
  const [rememberSettings, setRememberSettings] = useState(false);

  const [videoDevices, setVideoDevices] = useState(null);
  const [audioDevices, setAudioDevices] = useState(null);

  const [activeVideoDevice, setActiveVideoDevice] = useState('');
  const [activeAudioDevice, setActiveAudioDevice] = useState('');

  const [camMuted, setCamMuted] = useState(false);
  const [micMuted, setMicMuted] = useState(false);

  const [settingsModalActive, toggleSettingsModal] = useModal();
  const [aboutModalActive, toggleAboutModal] = useModal();

  const [errorAlertActive, toggleErrorAlert] = useAlertBox();
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const [version, setVersion] = useState();

  const router = useRouter();

  const isSupported = isDesktop && (isFirefox || isChrome);
  const [showAlert, setShowAlert] = useState(!isSupported);

  function handleError(message) {
    toggleErrorAlert();
    setErrorAlertMessage(`${message}`);
    console.error(message);
  }

  const getVideoDevices = async (client) => {
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

  const getAudioDevices = async (client) => {
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

  const handlePermissions = async () => {
    try {
      // Width and height are set to attempt to get max resolution video feed
      const maxWidth = client.config.streamConfig.maxResolution.width;
      const maxHeight = client.config.streamConfig.maxResolution.height;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            ideal: 1280,
            max: maxWidth,
          },
          height: {
            ideal: 720,
            max: maxHeight,
          },
          aspectRatio: { ideal: 1.7777777778 },
          frameRate: 30,
        },
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

    // If we still don't have permissions after requesting them display the error message
    if (!devicePermissions.video) {
      handleError("Failed to get video permissions.");
    } else if (!devicePermissions.audio) {
      handleError("Failed to get audio permissions.");
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
      const channelType = localStorage.getItem('channelType');
      let streamResolution = localStorage.getItem('streamResolution');
      const persistSettings = localStorage.getItem('rememberSettings');

      // Hotfix for localstorage issues
      if (streamResolution === '[object Object]') {
        streamResolution = '720';
      }

      if (sk) setStreamKey(sk);
      if (ingestEndpoint) setIngestServer(ingestEndpoint);
      if (channelType) setChannelType(channelType);
      if (streamResolution) setStreamResolution(streamResolution);
      if (persistSettings) setRememberSettings(persistSettings);
    }
  }, []);

  // Handle broadcast client changes...
  useEffect(() => {
    if (!client) {
      return;
    }

    // If a previous client exists, clean it and start fresh
    if (prevClient) {
      if (captureStream) {
        stopScreenShare(
          activeVideoDevice,
          camMuted,
          removeLayer,
          removeMixerDevice,
          updateLayer,
          client
        );
      }
      resetLayers(client, true, prevClient).then(() => {
        prevClient.delete();
      });
    }

    const handleClient = async () => {
      // If the user has not provided permissions, get them.
      if (!devicePermissions.video) {
        try {
          await handlePermissions();
        } catch (err) {
          console.error(err);
        }
      }

      client.config.logLevel = client.config.LOG_LEVEL.ERROR;

      const canvas = client.getCanvasDimensions();
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
      addLayer(camOffLayer, client);

      try {
        // Get video devices
        const vd = await getVideoDevices(client);
        setVideoDevices(vd);

        // Set default video device
        if (!activeVideoDevice) {
          setActiveVideoDevice(vd[0]);
        } else {
          renderActiveVideoDevice();
        }

        // Get audio devices
        const ad = await getAudioDevices(client);
        setAudioDevices(ad);

        // Set default audio device
        if (!activeAudioDevice) {
          setActiveAudioDevice(ad[0]);
        } else {
          renderActiveAudioDevice();
        }
      } catch (err) {
        handleError(
          'Error: Could not access any video or audio devices. Please ensure that your browser and OS privacy settings allow this app access to your camera and microphone.'
        );
      }
    };

    handleClient();
  }, [client, prevClient]);

  // Handle active video device (webcam) changes...
  useEffect(() => {
    if (!client) return;
    if (!activeVideoDevice) {
      console.error(
        'Error: Selected video device could not be added to the stream canvas:',
        activeVideoDevice
      );
      return;
    }

    const stream = client.getVideoInputDevice(CAM_LAYER_NAME);
    if (stream) {
      for (const track of stream.source.getVideoTracks()) {
        track.stop();
      }
    }
    renderActiveVideoDevice();
  }, [activeVideoDevice]);

  const renderActiveVideoDevice = () => {
    const canvas = client.getCanvasDimensions();

    let layer = {
      device: activeVideoDevice,
      name: CAM_LAYER_NAME,
      index: 4,
      visible: !camMuted,
      type: 'VIDEO',
    };

    if (captureStream) {
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

    addLayer(layer, client);
  };

  // Handle microphone device changes
  useEffect(() => {
    if (!client) return;
    if (!activeAudioDevice) {
      console.error(
        'Error: Selected audio device could not be added to the mixer:',
        activeAudioDevice
      );
      return;
    }
    renderActiveAudioDevice();
  }, [activeAudioDevice]);

  const renderActiveAudioDevice = () => {
    const mixerDevice = {
      name: MIC_LAYER_NAME,
      device: activeAudioDevice,
      muted: micMuted || false,
    };
    addMixerDevice(mixerDevice, client, micMuted);
  };

  // Handle channel type and resolution changes
  useEffect(() => {
    if (!client) return;
    if (isLive) return;

    client.detachPreview();

    // Get config details for the selected resolution and channel type
    const parsedConfig = getConfigFromResolution(streamResolution, channelType);
    const newClient = IVSBroadcastClient.create({
      streamConfig: {
        maxResolution: {
          width: parsedConfig.w,
          height: parsedConfig.h,
        },
        maxFramerate: 30,
        maxBitrate: parsedConfig.bitrate,
      },
    });
    
    const oldClient = client;
    setClient(newClient);
    setPrevClient(oldClient);
  }, [channelType, streamResolution]);

  // Handle URL Parameters
  useEffect(() => {
    const { uid, sk, playback, channelType } = router.query;
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

  const handleStream = async () => {
    if (ingestServer && streamKey) {
      toggleStream(ingestServer, streamKey, channelType, streamResolution, client, handleError);
    } else {
      handleSettings();
    }
  };

  const handleMicMute = async () => {
    const mixerDevice = {
      name: MIC_LAYER_NAME,
      device: activeAudioDevice,
      muted: micMuted,
    };

    const muted = toggleMixerDeviceMute(mixerDevice, client);
    setMicMuted(muted);
  };

  const handleCameraMute = async () => {
    const canvas = client.getCanvasDimensions();

    let camLayer = {
      device: activeVideoDevice,
      name: CAM_LAYER_NAME,
      index: 4,
      visible: camMuted,
      type: 'VIDEO',
    };

    if (captureStream) {
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
      await addLayer(camLayer, client);
      setCamMuted(false);
    } else {
      await removeLayer(camLayer, client);
      setCamMuted(true);
    }
  };

  const handleSettings = async () => {
    if (!settingsModalActive) {
      // Refresh video devices
      const vd = await getVideoDevices(client);
      setVideoDevices(vd);
      // Refresh audio devices
      const ad = await getAudioDevices(client);
      setAudioDevices(ad);
    }
    toggleSettingsModal();
  };

  const handleScreenShare = async () => {
    // If the SDK client is not available, throw an error
    if (!client) {
      handleError(`Screen share error: Broadcast SDK is not available.`);
      return;
    }
    // Toggle the state of the active screen share
    try {
      if (captureStream) {
        await stopScreenShare(
          activeVideoDevice,
          camMuted,
          removeLayer,
          removeMixerDevice,
          updateLayer,
          client
        );
      } else {
        await startScreenShare(
          activeVideoDevice,
          camMuted,
          updateLayer,
          addLayer,
          removeLayer,
          removeMixerDevice,
          addAudioTrack,
          client
        );
      }
    } catch (err) {
      handleError(`Screen share error: ${err.message}`);
    }
  };

  return (
    <>
      <div className={styles.broadcastWrapper}>
        <Head>
          <title>
            Amazon IVS – Web Broadcast Tool - {`${isLive ? 'LIVE' : 'Offline'}`}
          </title>
          <meta
            name='description'
            content='This tool can be used to stream your webcam and share your screen to an Amazon IVS Channel.'
          />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <Script
          src='https://web-broadcast.live-video.net/1.2.0/amazon-ivs-web-broadcast.js'
          strategy='afterInteractive'
          onLoad={() => {
            const parsedConfig = getConfigFromResolution(
              streamResolution,
              channelType
            );
            const IVSClient = IVSBroadcastClient.create({
              streamConfig: {
                maxResolution: {
                  width: parsedConfig.w,
                  height: parsedConfig.h,
                },
                maxFramerate: 30,
                maxBitrate: parsedConfig.bitrate,
              },
              logLevel: IVSBroadcastClient.LOG_LEVEL.ERROR,
            });
            setClient(IVSClient);
            setVersion(IVSBroadcastClient.__version);
          }}
        />
        <Script
          data-domain='stream.ivs.rocks'
          src='https://plausible.io/js/plausible.js'
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
            streamResolution={streamResolution}
          />
        </div>
        <div className={styles.streamPreview}>
          <StreamPreview
            client={client}
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
              streamButtonDisabled={streamLoading}
              isDesktop={isDesktop}
              errors={[]}
              micMuted={micMuted}
              camMuted={camMuted}
              screenShareActive={captureStream ? true : false}
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
          client={client}
          isSupported={isSupported}
          defaultChannelType={channelType}
          defaultIngestServer={ingestServer}
          defaultStreamKey={streamKey}
          defaultRemember={rememberSettings}
          defaultResolution={streamResolution}
          videoDevices={videoDevices}
          audioDevices={audioDevices}
          activeVideoDeviceId={
            activeVideoDevice ? activeVideoDevice.deviceId : ''
          }
          activeAudioDeviceId={
            activeAudioDevice ? activeAudioDevice.deviceId : ''
          }
          handleVideoDeviceSelect={(deviceId) => {
            const device = videoDevices.find(
              (device) => device.deviceId === deviceId
            );
            setActiveVideoDevice(device);
          }}
          handleAudioDeviceSelect={(deviceId) => {
            const device = audioDevices.find(
              (device) => device.deviceId === deviceId
            );
            setActiveAudioDevice(device);
          }}
          handleChannelTypeChange={(channelType) => {
            setChannelType(channelType);
          }}
          handleResolutionChange={(resolution) => {
            setStreamResolution(resolution);
          }}
          handleIngestChange={(server) => {
            setIngestServer(server);
          }}
          handleKeyChange={(key) => {
            setStreamKey(key);
          }}
          handleModalClose={toggleSettingsModal}
        />
      </Modal>
    </>
  );
}

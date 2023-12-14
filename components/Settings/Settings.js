import { useState, useEffect, useCallback, useContext } from 'react';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Spacer from '@/components/Spacer';
import Toggle from '@/components/Toggle';
import Icon from '@/components/Icon';
import { DeviceSelect } from './DeviceSelect';
import { UserSettingsContext } from '@/providers/UserSettingsContext';
import { BroadcastContext } from '@/providers/BroadcastContext';
import { BroadcastLayoutContext } from '@/providers/BroadcastLayoutContext';
import { LocalMediaContext } from '@/providers/LocalMediaContext';
import { ModalContext } from '@/providers/ModalContext';
import { getConfigFromResolution } from '@/utils/UserSettings';
import { BroadcastMixerContext } from '@/providers/BroadcastMixerContext';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const {
    channelType,
    setChannelType,
    savedVideoDeviceId,
    setSavedVideoDeviceId,
    savedAudioDeviceId,
    setSavedAudioDeviceId,
    orientation,
    setOrientation,
    resolution,
    setResolution,
    configRef,
    streamKey,
    setStreamKey,
    ingestEndpoint,
    setIngestEndpoint,
    localVideoMirror,
    setLocalVideoMirror,
    audioNoiseSuppression,
    setAudioNoiseSuppression,
    autoGainControl,
    setAutoGainControl,
    saveSettings,
    setSaveSettings,
    clearSavedSettings,
  } = useContext(UserSettingsContext);
  const { toggleModal } = useContext(ModalContext);
  const {
    audioDevices,
    videoDevices,
    canvasElemRef,
    localVideoDeviceId,
    localAudioStreamRef,
    localAudioDeviceId,
    updateLocalAudio,
    updateLocalVideo,
    enableCanvasCamera,
  } = useContext(LocalMediaContext);
  const { restartBroadcastClient, isLive } = useContext(BroadcastContext);
  const { micMuted, setMicMuted } = useContext(BroadcastMixerContext);
  const { setCamActive, refreshCurrentScene } = useContext(
    BroadcastLayoutContext
  );

  const [_streamKey, _setStreamKey] = useState(streamKey);

  const [_videoDevice, _setVideoDevice] = useState(localVideoDeviceId);
  const [_audioDevice, _setAudioDevice] = useState(localAudioDeviceId);

  const [_channelType, _setChannelType] = useState(channelType);
  const [_resolution, _setResolution] = useState(resolution);
  const [_ingestServer, _setIngestServer] = useState(ingestEndpoint);

  const [_localVideoMirror, _setLocalVideoMirror] = useState(localVideoMirror);
  const [_orientation, _setOrientation] = useState(orientation);

  const [_streamKeyError, _setStreamKeyError] = useState();
  const [_ingestError, _setIngestError] = useState();

  const [savingSettings, setSavingSettings] = useState(false);

  // This effect is called when the the stream key and
  // ingest server are changed
  useEffect(() => {
    // If the stream key is empty, show an error
    if (!ingestEndpoint) {
      _setIngestError(
        'Enter a valid ingest endpoint to start streaming. For example, 1234567890ab.global-contribute.live-video.net'
      );
    }
    if (!streamKey) {
      _setStreamKeyError(
        'Enter a valid stream key to start streaming. For example, sk_us-west-2_abcdABCDefgh_567890abcdef'
      );
    }
  }, [ingestEndpoint, streamKey]);

  const ingestFieldRef = useCallback(
    (ingestFieldNode) => {
      // If the ingestFieldNode is mounted and there is no
      // default ingest server or stream key set
      // Scroll to the errored fields so that they are visible.
      if (ingestFieldNode && !streamKey) {
        ingestFieldNode.scrollIntoView();
      }
    },
    [streamKey]
  );

  const handleLocalModalSave = async (e) => {
    // When the modal is saved, update values if they have
    // been changed.
    setSavingSettings(true);

    // If a client update is required, complete the update first before
    // updating other settings
    let clientUpdateRequired = false;
    let sceneRefreshRequired = false;
    let _videoStream = undefined;

    if (_videoDevice !== localVideoDeviceId) {
      _videoStream = await updateLocalVideo(_videoDevice);
      setCamActive(true);
      sceneRefreshRequired = true;
    }

    if (_audioDevice !== localAudioDeviceId) {
      await updateLocalAudio(_audioDevice);
      setMicMuted(false);
      sceneRefreshRequired = true;
    }

    if (_channelType !== channelType) {
      setChannelType(_channelType);
      clientUpdateRequired = true;
      sceneRefreshRequired = true;
    }

    if (_resolution !== resolution) {
      setResolution(_resolution);
      clientUpdateRequired = true;
      sceneRefreshRequired = true;
    }

    if (_orientation !== orientation) {
      setOrientation(_orientation);
      clientUpdateRequired = true;
      sceneRefreshRequired = true;
    }

    if (_ingestServer !== ingestEndpoint) {
      setIngestEndpoint(_ingestServer);
    }

    if (_streamKey !== streamKey) {
      setStreamKey(_streamKey);
    }

    if (_localVideoMirror !== localVideoMirror) {
      setLocalVideoMirror(_localVideoMirror);
    }

    // If a client update is required, update the client
    if (clientUpdateRequired) {
      const newConfig = getConfigFromResolution(
        _resolution,
        _channelType,
        _orientation
      );

      await restartBroadcastClient({
        config: newConfig,
        ingestEndpoint: _ingestServer,
      });

      configRef.current = newConfig;
    }
    if (sceneRefreshRequired) {
      await refreshCurrentScene({
        cameraContent: enableCanvasCamera
          ? canvasElemRef.current
          : _videoStream,
        cameraId: _videoDevice,
        micContent: localAudioStreamRef.current,
        micId: _audioDevice,
        showMuteIcon: micMuted,
      });
    }

    if (saveSettings) {
      setSavedVideoDeviceId(_videoDevice);
      setSavedAudioDeviceId(_audioDevice);
    } else {
      clearSavedSettings();
    }

    toggleModal();
    setSavingSettings(false);
  };

  return (
    <div className='grid grid-rows-[1fr_auto] gap-y-5 w-full max-w-xl h-[100dvh] bg-surface text-uiText shadow-xl'>
      <div className='px-6 py-8 pb-0 overflow-y-auto overflow-x-hidden'>
        <div className='flex items-end mb-4'>
          <h2 className='text-xl'>Stream Settings</h2>
        </div>
        <div className='mb-2'>
          <form
            className='flex flex-row flex-wrap gap-6'
            onSubmit={(e) => e.preventDefault()}
          >
            <div className='flex flex-col w-full gap-y-2'>
              <DeviceSelect
                items={videoDevices}
                name={'Webcam'}
                id={'webcam-select'}
                onChange={(option) => {
                  _setVideoDevice(option.value);
                }}
                activeDeviceId={_videoDevice}
              />
              <Toggle
                label='Mirror webcam preview'
                onChange={(checked) => {
                  _setLocalVideoMirror(checked);
                }}
                defaultValue={_localVideoMirror}
              />
            </div>
            <DeviceSelect
              items={audioDevices}
              name={'Mic'}
              id={'mic-select'}
              onChange={(option) => {
                _setAudioDevice(option.value);
              }}
              activeDeviceId={_audioDevice}
            />
          </form>
          <Spacer />
          <form
            className='flex flex-row flex-wrap gap-6'
            onSubmit={(e) => e.preventDefault()}
          >
            <fieldset className='w-full m-0 p-0 border-0'>
              <label className='block text-sm' htmlFor='select-channelType'>
                Channel type
              </label>
              <Select
                id='select-channelType'
                onChange={(option) => {
                  _setChannelType(option.value);
                }}
                defaultValue={_channelType}
                options={[
                  {
                    value: 'STANDARD',
                    label: 'Standard',
                  },
                  {
                    value: 'BASIC',
                    label: 'Basic',
                  },
                  {
                    value: 'ADVANCED_HD',
                    label: 'Advanced HD',
                  },
                  {
                    value: 'ADVANCED_SD',
                    label: 'Advanced SD',
                  },
                ]}
                disabled={isLive}
                hint={
                  <>
                    The channel type that corresponds to the Amazon IVS Channel
                    you are streaming to. For details, view the{' '}
                    <a
                      href='https://docs.aws.amazon.com/ivs/latest/userguide/streaming-config.html#streaming-config-settings-channel-types'
                      target='_blank'
                      rel='noreferrer noopener'
                      className='text-primaryAlt dark-theme:text-primary hover:text-primary hover:dark-theme:text-primaryAlt hover:underline underline-offset-1'
                    >
                      Amazon IVS Documentation↗
                    </a>
                  </>
                }
              />
            </fieldset>
            <fieldset className='w-full m-0 p-0 border-0'>
              <label className='block text-sm' htmlFor='select-resolution'>
                Stream Resolution
              </label>
              <Select
                id='select-resolution'
                onChange={(option) => {
                  _setResolution(option.value);
                }}
                defaultValue={_resolution}
                options={[
                  {
                    value: '1080',
                    label: 'HD 1080p',
                  },
                  {
                    value: '720',
                    label: 'HD 720p',
                  },
                  {
                    value: '480',
                    label: 'SD 480p',
                  },
                  {
                    value: '360',
                    label: 'SD 360p',
                  },
                ]}
                disabled={isLive}
              />
            </fieldset>
            <Spacer size='sm' />
            <fieldset className='w-full m-0 p-0 border-0'>
              <label className='block text-sm' htmlFor='select-resolution'>
                Orientation
              </label>
              <Select
                id='select-orientation'
                onChange={(option) => {
                  _setOrientation(option.value);
                }}
                defaultValue={_orientation}
                options={[
                  {
                    value: 'LANDSCAPE',
                    label: 'Landscape',
                  },
                  {
                    value: 'PORTRAIT',
                    label: 'Portrait',
                  },
                ]}
                disabled={isLive}
              />
            </fieldset>
            <Spacer size='sm' />
            <fieldset className='w-full m-0 p-0 border-0'>
              <label
                className='block text-sm'
                htmlFor='input-ingest'
                ref={ingestFieldRef}
              >
                Ingest endpoint
              </label>
              <Input
                id='input-ingest'
                onChange={(e) => {
                  _setIngestServer(e.target.value);
                  _setIngestError('');
                }}
                defaultValue={_ingestServer}
                error={_ingestError}
                placeholder={'ingest.global-contribute.live-video.net'}
                autoFocus={_ingestError ? true : false}
                disabled={isLive}
                hint={
                  'Example ingest endpoint: a1b2c3d4e5f6.global-contribute.live-video.net'
                }
              />
            </fieldset>
            <fieldset className='w-full m-0 p-0 border-0'>
              <label className='block text-sm' htmlFor='input-key'>
                Stream key
              </label>
              <Input
                id='input-key'
                type='password'
                onChange={(e) => {
                  _setStreamKey(e.target.value);
                  _setStreamKeyError('');
                }}
                defaultValue={_streamKey}
                error={_streamKeyError}
                placeholder={'sk_us-west-2_abcdABCDefgh_567890abcdef'}
                disabled={isLive}
                hint={
                  'The stream key for your Amazon IVS channel. It usually begins with sk_'
                }
                autoFocus={_streamKeyError ? true : false}
              />
            </fieldset>
            <div className='flex mt-2 p-4 gap-2 rounded-md bg-primary/10 border border-primary/20'>
              <Icon>
                <InformationCircleIcon className='text-current w-5 h-5' />
              </Icon>
              <p className='text-sm inline-block text-uiText mt-px'>
                The ingest endpoint, stream key, and channel type can be found
                in the{' '}
                <a
                  href='https://console.aws.amazon.com/ivs/channels'
                  target='_blank'
                  rel='noreferrer noopener'
                  className='text-primaryAlt dark-theme:text-primary hover:text-primary hover:dark-theme:text-primaryAlt hover:underline underline-offset-1'
                >
                  AWS console↗
                </a>
                .
              </p>
            </div>
          </form>
          <Spacer />
          <fieldset className='w-full m-0 p-0 border-0'>
            <Toggle
              label='Remember my settings on this browser'
              onChange={(checked) => {
                setSaveSettings(checked);
              }}
              defaultValue={saveSettings}
            />
          </fieldset>
        </div>
      </div>
      <footer className='flex w-full items-end gap-2 px-6 py-8 pt-0'>
        <Button
          style='roundedText'
          fullWidth={true}
          onClick={toggleModal}
          disabled={savingSettings}
        >
          Cancel
        </Button>
        <Button
          type='primary'
          style='roundedText'
          fullWidth={true}
          onClick={handleLocalModalSave}
          loading={savingSettings}
        >
          Save
        </Button>
      </footer>
    </div>
  );
}

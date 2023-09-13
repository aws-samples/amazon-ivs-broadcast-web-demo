import styles from './Settings.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../Button';
import Select from '../Select';
import Input from '../Input';
import Checkbox from '../Checkbox';
import Spacer from '../Spacer';

function DeviceSelect({ activeDeviceId, items, name, id, onChange }) {
  return (
    <fieldset className={styles.deviceSelectField}>
      <label
        className={styles.deviceSelectLabel}
        htmlFor={`${id}`}
      >{`${name}`}</label>
      <Select
        onChange={onChange}
        defaultValue={activeDeviceId}
        options={items.map((item, i) => {
          return { value: item.deviceId, label: item.label };
        })}
        id={`${id}`}
      />
    </fieldset>
  );
}

export default function Settings({
  isSupported,
  defaultChannelType,
  defaultResolution,
  defaultIngestServer,
  defaultStreamKey,
  defaultRemember,
  videoDevices,
  audioDevices,
  activeVideoDeviceId,
  activeAudioDeviceId,
  handleVideoDeviceSelect,
  handleAudioDeviceSelect,
  handleModalClose,
  handleChannelTypeChange,
  handleResolutionChange,
  handleIngestChange,
  handleKeyChange,
  isLive,
  handleClientRefresh,
}) {
  const previewRef = useRef(null);
  const ingestFieldRef = useCallback((ingestFieldNode) => {
    // If the ingestFieldNode is mounted and there is no
    // default ingest server or stream key set
    // Scroll to the errored fields so that they are visible.
    if (ingestFieldNode && (!defaultIngestServer || !defaultStreamKey)) {
      ingestFieldNode.scrollIntoView();
    }
  });

  const [selectedVideoDeviceId, setSelectedVideoDeviceId] =
    useState(activeVideoDeviceId);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] =
    useState(activeAudioDeviceId);
  const [localKey, setLocalKey] = useState(defaultStreamKey);
  const [localChannelType, setLocalChannelType] = useState(defaultChannelType);
  const [localResolution, setLocalResolution] = useState(defaultResolution);
  const [localIngestServer, setLocalIngestServer] =
    useState(defaultIngestServer);

  const [localKeyError, setLocalKeyError] = useState();
  const [localIngestError, setLocalIngestError] = useState();

  const [previewVideoStream, setPreviewVideoStream] = useState(null);
  const [saveToLocalStorage, setSaveToLocalStorage] = useState(defaultRemember);

  // This effect is called when the previewRef
  // or selectedVideoDeviceId are changed
  useEffect(() => {
    if (!previewRef) return;
    if (!selectedVideoDeviceId) return;
    if (!isSupported) return;
    // Get the video stream from the selected device

    // If there's an existing video preview, stop it before proceeding.
    if (previewVideoStream) {
      for (const track of previewVideoStream.getTracks()) {
        track.stop();
      }
      if (previewRef.current) previewRef.current.srcObject = null;
    }

    // Get media devices and preview them
    navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: { exact: selectedVideoDeviceId },
          width: 1280,
          height: 720,
        },
      })
      .then((stream) => {
        const video = previewRef.current;
        window.videoPreview = previewRef.current;
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
          video.play();
        };

        setPreviewVideoStream(stream);
      })
      .catch(function (err) {
        console.error(err.name + ': ' + err.message);
      });

    return () => {
      if (previewVideoStream) {
        for (const track of previewVideoStream.getTracks()) {
          track.stop();
        }
      }
    };
  }, [selectedVideoDeviceId]);

  // This effect is called when the the stream key and
  // ingest server are changed
  useEffect(() => {
    // If the stream key is empty, show an error
    if (!defaultIngestServer) {
      setLocalIngestError(
        'Enter a valid ingest endpoint to start streaming. For example, <UNIQUE_ID>.global-contribute.live-video.net'
      );
    }
    if (!defaultStreamKey) {
      setLocalKeyError(
        'Enter a valid stream key to start streaming. For example, sk_us-west-2_abcdABCDefgh_567890abcdef'
      );
    }
  }, [defaultIngestServer, defaultStreamKey]);

  const handleLocalVideoDeviceSelect = (e) => {
    setSelectedVideoDeviceId(e.target.value);
  };

  const handleLocalAudioDeviceSelect = (e) => {
    setSelectedAudioDeviceId(e.target.value);
  };

  const handleLocalChannelTypeChange = (e) => {
    setLocalChannelType(e.target.value);
  };

  const handleLocalIngestChange = (e) => {
    setLocalIngestServer(e.target.value);
    setLocalIngestError('');
  };

  const handleLocalKeyChange = (e) => {
    setLocalKey(e.target.value);
    setLocalKeyError('');
  };

  const handleRememberChange = (checked) => {
    setSaveToLocalStorage(checked);
  };

  const handleLocalResolutionChange = (e) => {
    const value = e.target.value;
    setLocalResolution(value);
  };

  const handleLocalModalSave = (e) => {
    // When the modal is saved, update values if they have
    // been changed.
    if (saveToLocalStorage) {
      storeSettings();
    } else {
      clearSettings();
    }

    // If a client update is required, complete the update first before
    // updating other settings
    let clientUpdateRequired = false;
    if (localChannelType !== defaultChannelType) {
      handleChannelTypeChange(localChannelType);
      clientUpdateRequired = true;
    }
    if (localResolution !== defaultResolution) {
      handleResolutionChange(localResolution);
      clientUpdateRequired = true;
    }

    // Update video and audio devices. If a client update is not
    // required, the current client will be refreshed by the device select handlers
    if (selectedVideoDeviceId !== activeVideoDeviceId) {
      handleVideoDeviceSelect(selectedVideoDeviceId, clientUpdateRequired);
    }
    if (selectedAudioDeviceId !== activeAudioDeviceId) {
      handleAudioDeviceSelect(selectedAudioDeviceId, clientUpdateRequired);
    }

    // Update ingest server and stream key if required
    if (localIngestServer !== defaultIngestServer) {
      handleIngestChange(localIngestServer);
    }
    if (localKey !== defaultIngestServer) {
      handleKeyChange(localKey);
    }

    // If a client update is required, update the client
    if (clientUpdateRequired) {
      handleClientRefresh();
    }

    handleModalClose();
  };

  const storeSettings = () => {
    localStorage.setItem('sk', localKey);
    localStorage.setItem('ingestEndpoint', localIngestServer);
    localStorage.setItem('channelType', localChannelType);
    localStorage.setItem('streamResolution', localResolution);
    localStorage.setItem('rememberSettings', saveToLocalStorage);
    localStorage.setItem('savedVideoDeviceId', selectedVideoDeviceId);
    localStorage.setItem('savedAudioDeviceId', selectedAudioDeviceId);
  };

  const clearSettings = () => {
    localStorage.removeItem('sk');
    localStorage.removeItem('ingestEndpoint');
    localStorage.removeItem('channelType');
    localStorage.removeItem('streamResolution');
    localStorage.removeItem('rememberSettings');
    localStorage.removeItem('savedVideoDeviceId');
    localStorage.removeItem('savedAudioDeviceId');
  };

  return (
    <div className={styles.settingsWrapper}>
      <div className={styles.settingsContent}>
        <div className={styles.settingsTitle}>
          <h2>Stream Settings</h2>
        </div>
        <div className={styles.settingsContentBody}>
          {isSupported ? (
            <div className={styles.previewWrapper}>
              <div className={styles.previewInner}>
                <video
                  autoPlay={true}
                  playsInline={true}
                  muted={true}
                  className={styles.previewVideo}
                  ref={previewRef}
                ></video>
              </div>
            </div>
          ) : (
            <></>
          )}
          <form
            className={styles.settingsForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <DeviceSelect
              items={videoDevices}
              name={'Webcam'}
              id={'webcam-select'}
              onChange={handleLocalVideoDeviceSelect}
              activeDeviceId={selectedVideoDeviceId}
            />
            {/* <Checkbox
              label="Mirror webcam video"
              onChange={handleMirrorVideo}
              defaultValue={localStorage.getItem("rememberSettings") || false}
            /> */}
            <DeviceSelect
              items={audioDevices}
              name={'Mic'}
              id={'mic-select'}
              onChange={handleLocalAudioDeviceSelect}
              activeDeviceId={selectedAudioDeviceId}
            />
          </form>
          <Spacer />
          <form
            className={styles.settingsForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <fieldset className={styles.deviceSelectField}>
              <label
                className={styles.deviceSelectLabel}
                htmlFor='select-channelType'
              >
                Channel type
              </label>
              <Select
                id='select-channelType'
                onChange={handleLocalChannelTypeChange}
                defaultValue={localChannelType}
                options={[
                  {
                    value: 'STANDARD',
                    label: 'Standard',
                  },
                  {
                    value: 'BASIC',
                    label: 'Basic',
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
                    >
                      Amazon IVS Documentation↗
                    </a>
                  </>
                }
              />
            </fieldset>
            <fieldset className={styles.deviceSelectField}>
              <label
                className={styles.deviceSelectLabel}
                htmlFor='select-resolution'
              >
                Stream Resolution
              </label>
              <Select
                id='select-resolution'
                onChange={handleLocalResolutionChange}
                defaultValue={localResolution}
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
            <fieldset className={styles.deviceSelectField}>
              <label
                className={styles.deviceSelectLabel}
                htmlFor='input-ingest'
                ref={ingestFieldRef}
              >
                Ingest endpoint
              </label>
              <Input
                id='input-ingest'
                onChange={handleLocalIngestChange}
                defaultValue={localIngestServer}
                error={localIngestError}
                placeholder={'a1b2c3d4e5f6.global-contribute.live-video.net'}
                autoFocus={localIngestError ? true : false}
                hint={
                  'Example ingest endpoint: a1b2c3d4e5f6.global-contribute.live-video.net'
                }
              />
            </fieldset>
            <fieldset className={styles.deviceSelectField}>
              <label className={styles.deviceSelectLabel} htmlFor='input-key'>
                Stream key
              </label>
              <Input
                id='input-key'
                type='password'
                onChange={handleLocalKeyChange}
                defaultValue={localKey}
                error={localKeyError}
                placeholder={'sk_us-west-2_abcdABCDefgh_567890abcdef'}
                hint={
                  'The stream key for your Amazon IVS channel. It usually begins with sk_'
                }
                autoFocus={localKeyError ? true : false}
              />
            </fieldset>
            <p>
              The ingest endpoint, stream key, and channel type can be found in
              the{' '}
              <a
                href='https://console.aws.amazon.com/ivs/channels'
                target='_blank'
                rel='noreferrer noopener'
              >
                AWS console↗
              </a>
              .
            </p>
            <Spacer size='sm' />
            <fieldset className={styles.deviceSelectField}>
              <Checkbox
                label='Remember my settings on this browser'
                onChange={handleRememberChange}
                defaultValue={localStorage.getItem('rememberSettings') || false}
              />
            </fieldset>
          </form>
        </div>
      </div>
      <footer className={styles.settingsFooter}>
        <Button type={'base'} fullWidth={true} onClick={handleModalClose}>
          Cancel
        </Button>
        <Button
          type={'primary'}
          fullWidth={true}
          onClick={handleLocalModalSave}
        >
          Save
        </Button>
      </footer>
    </div>
  );
}

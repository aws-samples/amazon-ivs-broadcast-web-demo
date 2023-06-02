import styles from './ControlBar.module.css';
import Button from '../Button';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
import { useState, useEffect } from 'react';

function MuteButton({ muted, handleMicMute, ...additionalProps }) {
  const buttonStyle = muted ? 'destruct' : 'base';
  return (
    <Button
      type={`${buttonStyle}`}
      style='round'
      onClick={handleMicMute}
      {...additionalProps}
    >
      {!muted ? (
        <Icon>
          <svg
            width='48'
            height='48'
            viewBox='0 0 48 48'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M24 26.85q-2.15 0-3.6-1.55-1.45-1.55-1.45-3.75V9q0-2.1 1.475-3.55Q21.9 4 24 4t3.575 1.45Q29.05 6.9 29.05 9v12.55q0 2.2-1.45 3.75-1.45 1.55-3.6 1.55Zm0-11.4ZM24 42q-.65 0-1.075-.425-.425-.425-.425-1.075v-5.3q-4.9-.55-8.375-3.925Q10.65 27.9 10.1 23.15q-.1-.65.375-1.125t1.175-.475q.55 0 .95.4.4.4.5.95.55 4.05 3.65 6.725Q19.85 32.3 24 32.3t7.25-2.675q3.1-2.675 3.65-6.725.1-.55.525-.95.425-.4.975-.4.7 0 1.15.475.45.475.35 1.125-.55 4.75-4.025 8.125Q30.4 34.65 25.5 35.2v5.3q0 .65-.425 1.075Q24.65 42 24 42Zm0-18.15q.9 0 1.475-.675.575-.675.575-1.625V9q0-.85-.6-1.425Q24.85 7 24 7t-1.45.575q-.6.575-.6 1.425v12.55q0 .95.575 1.625T24 23.85Z' />
          </svg>
        </Icon>
      ) : (
        <Icon>
          <svg
            width='48'
            height='48'
            viewBox='0 0 48 48'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M34.3 29.95 32.15 27.8Q33 26.75 33.475 25.5Q33.95 24.25 34.1 22.9Q34.2 22.35 34.625 21.95Q35.05 21.55 35.6 21.55Q36.3 21.55 36.75 22.025Q37.2 22.5 37.1 23.15Q36.85 25 36.15 26.75Q35.45 28.5 34.3 29.95ZM27.9 23.55 25.25 20.95V9.05Q25.25 8.2 24.65 7.6Q24.05 7 23.2 7Q22.35 7 21.75 7.6Q21.15 8.2 21.15 9.05V16.8L18.15 13.8V9.05Q18.15 6.95 19.625 5.475Q21.1 4 23.2 4Q25.3 4 26.775 5.475Q28.25 6.95 28.25 9.05V21.55Q28.25 21.95 28.175 22.55Q28.1 23.15 27.9 23.55ZM23.05 18.7Q23.05 18.7 23.05 18.7Q23.05 18.7 23.05 18.7Q23.05 18.7 23.05 18.7Q23.05 18.7 23.05 18.7ZM40.55 44.3 2.75 6.5Q2.35 6.1 2.35 5.525Q2.35 4.95 2.75 4.55Q3.15 4.15 3.7 4.15Q4.25 4.15 4.65 4.55L42.5 42.4Q42.9 42.8 42.9 43.35Q42.9 43.9 42.5 44.3Q42.1 44.7 41.525 44.7Q40.95 44.7 40.55 44.3ZM21.7 40.5V35.2Q16.8 34.65 13.325 31.275Q9.85 27.9 9.3 23.15Q9.2 22.5 9.675 22.025Q10.15 21.55 10.85 21.55Q11.4 21.55 11.8 21.95Q12.2 22.35 12.3 22.9Q12.85 26.95 15.95 29.625Q19.05 32.3 23.2 32.3Q25.1 32.3 26.85 31.675Q28.6 31.05 30.05 29.95L32.2 32.1Q30.65 33.4 28.75 34.175Q26.85 34.95 24.7 35.2V40.5Q24.7 41.15 24.275 41.575Q23.85 42 23.2 42Q22.55 42 22.125 41.575Q21.7 41.15 21.7 40.5Z' />
          </svg>
        </Icon>
      )}
    </Button>
  );
}

function CamButton({ muted, handleCameraMute, ...additionalProps }) {
  const buttonStyle = muted ? 'destruct' : 'base';
  return (
    <Button
      type={`${buttonStyle}`}
      style='round'
      onClick={handleCameraMute}
      {...additionalProps}
    >
      {!muted ? (
        <Icon>
          <svg
            width='48'
            height='48'
            viewBox='0 0 48 48'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M7 40Q5.8 40 4.9 39.1Q4 38.2 4 37V11Q4 9.8 4.9 8.9Q5.8 8 7 8H33Q34.2 8 35.1 8.9Q36 9.8 36 11V21.75L42.7 15.05Q43.05 14.7 43.525 14.875Q44 15.05 44 15.55V32.45Q44 32.95 43.525 33.125Q43.05 33.3 42.7 32.95L36 26.25V37Q36 38.2 35.1 39.1Q34.2 40 33 40ZM7 37H33Q33 37 33 37Q33 37 33 37V11Q33 11 33 11Q33 11 33 11H7Q7 11 7 11Q7 11 7 11V37Q7 37 7 37Q7 37 7 37ZM7 37Q7 37 7 37Q7 37 7 37V11Q7 11 7 11Q7 11 7 11Q7 11 7 11Q7 11 7 11V37Q7 37 7 37Q7 37 7 37Z' />
          </svg>
        </Icon>
      ) : (
        <Icon>
          <svg
            width='48'
            height='48'
            viewBox='0 0 48 48'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='m42.7 32.95-6.7-6.7v5.55l-3-3V11H15.2l-3-3H33q1.2 0 2.1.9.9.9.9 2.1v10.75l6.7-6.7q.35-.35.825-.175t.475.675v16.9q0 .5-.475.675-.475.175-.825-.175ZM41.35 45.6 2.95 7.2q-.4-.4-.4-1T3 5.15q.45-.45 1.05-.45.6 0 1.05.45l38.4 38.4q.4.4.4 1t-.45 1.05q-.45.45-1.05.45-.6 0-1.05-.45ZM24.2 20ZM7.95 8l3 3H7v26h26v-3.95l3 3V37q0 1.2-.9 2.1-.9.9-2.1.9H7q-1.2 0-2.1-.9Q4 38.2 4 37V11q0-1.2.9-2.1Q5.8 8 7 8Zm11.9 16.1Z' />
          </svg>
        </Icon>
      )}
    </Button>
  );
}

function ScreenShareButton({ active, handleScreenShare, ...additionalProps }) {
  const buttonStyle = active ? 'primary' : 'base';
  return (
    <Button
      type={`${buttonStyle}`}
      style='round'
      onClick={handleScreenShare}
      {...additionalProps}
    >
      <Icon>
        {active ? (
          <svg
            width='48'
            height='48'
            viewBox='0 0 48 48'
            xmlns='http://www.w3.org/2000/svg'
            id='endShare'
          >
            <path d='m27.6 23.75-5.4-5.4h4.3v-1.7q0-.5.475-.675.475-.175.825.175l3.15 3.15q.05.05.25.55 0 .1-.25.55Zm12.65 12.7-3-3h3.45V9.3H13.1l-3-3h30.6q1.2 0 2.1.9.9.9.9 2.1v24.15q0 1.3-1 2.2-1 .9-2.45.8Zm.55 9.05L37 41.75H3.5q-.65 0-1.075-.425Q2 40.9 2 40.25q0-.65.425-1.075.425-.425 1.075-.425H34l-2.3-2.3H7.35q-1.2 0-2.1-.9-.9-.9-.9-2.1V9.1l-1.7-1.7q-.45-.45-.45-1.075t.45-1.075q.45-.45 1.075-.45t1.075.45L42.95 43.4q.45.45.45 1.05 0 .6-.45 1.05-.45.45-1.075.45T40.8 45.5ZM19.65 24.4v2.75q0 .65-.425 1.075-.425.425-1.075.425-.65 0-1.075-.425-.425-.425-.425-1.075v-3q0-.5.1-1.125t.35-1.175L7.35 12.1v21.35H28.7Zm4.4-2.6Zm-6 .95Z' />
          </svg>
        ) : (
          <svg
            width='48'
            height='48'
            viewBox='0 0 48 48'
            xmlns='http://www.w3.org/2000/svg'
            id='startShare'
          >
            <path d='M18.15 28.65q.65 0 1.075-.425.425-.425.425-1.075v-3q0-1.2.8-2t2-.8h4.05v1.7q0 .5.475.675.475.175.825-.175l3.15-3.15q.05-.05.25-.55 0-.1-.25-.55l-3.15-3.15q-.35-.35-.825-.175t-.475.675v1.7h-4.05q-2.4 0-4.1 1.7-1.7 1.7-1.7 4.1v3q0 .65.425 1.075.425.425 1.075.425ZM7 36q-1.25 0-2.125-.875T4 33V9q0-1.25.875-2.125T7 6h34q1.25 0 2.125.875T44 9v24q0 1.25-.875 2.125T41 36Zm0-3h34V9H7v24Zm-3.5 9q-.65 0-1.075-.425Q2 41.15 2 40.5q0-.65.425-1.075Q2.85 39 3.5 39h41q.65 0 1.075.425Q46 39.85 46 40.5q0 .65-.425 1.075Q45.15 42 44.5 42ZM7 9v24V9Z' />
          </svg>
        )}
      </Icon>
    </Button>
  );
}

function SettingsButton({ handleSettings, ...additionalProps }) {
  return (
    <Button style='round' onClick={handleSettings} {...additionalProps}>
      <Icon>
        <svg
          width='48'
          height='48'
          viewBox='0 0 48 48'
          xmlns='http://www.w3.org/2000/svg'
          id='cog'
        >
          <path d='M27.3 44H20.7Q20.15 44 19.725 43.65Q19.3 43.3 19.2 42.75L18.4 37.7Q17.45 37.35 16.4 36.75Q15.35 36.15 14.55 35.5L9.9 37.65Q9.35 37.9 8.8 37.725Q8.25 37.55 7.95 37L4.65 31.15Q4.35 30.65 4.5 30.1Q4.65 29.55 5.1 29.2L9.4 26.05Q9.3 25.6 9.275 25.025Q9.25 24.45 9.25 24Q9.25 23.55 9.275 22.975Q9.3 22.4 9.4 21.95L5.1 18.8Q4.65 18.45 4.5 17.9Q4.35 17.35 4.65 16.85L7.95 11Q8.25 10.45 8.8 10.275Q9.35 10.1 9.9 10.35L14.55 12.5Q15.35 11.85 16.4 11.25Q17.45 10.65 18.4 10.35L19.2 5.25Q19.3 4.7 19.725 4.35Q20.15 4 20.7 4H27.3Q27.85 4 28.275 4.35Q28.7 4.7 28.8 5.25L29.6 10.3Q30.55 10.65 31.625 11.225Q32.7 11.8 33.45 12.5L38.1 10.35Q38.65 10.1 39.2 10.275Q39.75 10.45 40.05 11L43.35 16.8Q43.65 17.3 43.525 17.875Q43.4 18.45 42.9 18.8L38.6 21.85Q38.7 22.35 38.725 22.925Q38.75 23.5 38.75 24Q38.75 24.5 38.725 25.05Q38.7 25.6 38.6 26.1L42.9 29.2Q43.35 29.55 43.5 30.1Q43.65 30.65 43.35 31.15L40.05 37Q39.75 37.55 39.2 37.725Q38.65 37.9 38.1 37.65L33.45 35.5Q32.65 36.15 31.625 36.775Q30.6 37.4 29.6 37.7L28.8 42.75Q28.7 43.3 28.275 43.65Q27.85 44 27.3 44ZM24 30.5Q26.7 30.5 28.6 28.6Q30.5 26.7 30.5 24Q30.5 21.3 28.6 19.4Q26.7 17.5 24 17.5Q21.3 17.5 19.4 19.4Q17.5 21.3 17.5 24Q17.5 26.7 19.4 28.6Q21.3 30.5 24 30.5ZM24 27.5Q22.55 27.5 21.525 26.475Q20.5 25.45 20.5 24Q20.5 22.55 21.525 21.525Q22.55 20.5 24 20.5Q25.45 20.5 26.475 21.525Q27.5 22.55 27.5 24Q27.5 25.45 26.475 26.475Q25.45 27.5 24 27.5ZM24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24ZM21.8 41H26.2L26.9 35.4Q28.55 35 30.025 34.15Q31.5 33.3 32.7 32.1L38 34.4L40 30.8L35.3 27.35Q35.5 26.5 35.625 25.675Q35.75 24.85 35.75 24Q35.75 23.15 35.65 22.325Q35.55 21.5 35.3 20.65L40 17.2L38 13.6L32.7 15.9Q31.55 14.6 30.1 13.725Q28.65 12.85 26.9 12.6L26.2 7H21.8L21.1 12.6Q19.4 12.95 17.925 13.8Q16.45 14.65 15.3 15.9L10 13.6L8 17.2L12.7 20.65Q12.5 21.5 12.375 22.325Q12.25 23.15 12.25 24Q12.25 24.85 12.375 25.675Q12.5 26.5 12.7 27.35L8 30.8L10 34.4L15.3 32.1Q16.5 33.3 17.975 34.15Q19.45 35 21.1 35.4Z' />
        </svg>
      </Icon>
    </Button>
  );
}

function StreamButton({
  isLive,
  handleStream,
  loading,
  disabled,
  ...additionalProps
}) {
  const buttonStyle = isLive ? 'destruct' : 'primary';
  const buttonContent = isLive ? 'Stop streaming' : 'Start streaming';

  return (
    <Button
      type={`${buttonStyle}`}
      style='roundedText'
      onClick={handleStream}
      fullWidth={'responsive'}
      disabled={disabled}
      loading={loading}
      {...additionalProps}
    >
      {buttonContent}
    </Button>
  );
}

export default function ControlBar({
  isLive,
  streamLoading,
  isDesktop,
  videoPermissions,
  micMuted,
  camMuted,
  screenShareActive,
  handleMicMute,
  handleCameraMute,
  handleScreenShare,
  handleSettings,
  handleStream,
  handleAboutClick,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render this component in a browser.
  return (
    mounted && (
      <div className={styles.controlBar}>
        <Tooltip content={`${micMuted ? 'Unmute' : 'Mute'}`}>
          <MuteButton
            muted={micMuted}
            handleMicMute={handleMicMute}
            disabled={!videoPermissions}
          />
        </Tooltip>
        <Tooltip content={`${camMuted ? 'Show camera' : 'Hide camera'}`}>
          <CamButton
            muted={camMuted}
            handleCameraMute={handleCameraMute}
            disabled={!videoPermissions}
          />
        </Tooltip>
        {isDesktop && (
          <Tooltip
            content={`${
              screenShareActive ? 'Stop sharing' : 'Share your screen'
            }`}
          >
            <ScreenShareButton
              active={screenShareActive}
              handleScreenShare={handleScreenShare}
              disabled={!videoPermissions}
            />
          </Tooltip>
        )}
        <Tooltip content='Open settings'>
          <SettingsButton
            handleSettings={handleSettings}
            disabled={!videoPermissions}
          />
        </Tooltip>
        <div className={styles.responsiveShow}>
          <Tooltip content='About this tool'>
            <Button type={'base'} style='round' onClick={handleAboutClick}>
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
        <StreamButton
          isLive={isLive}
          handleStream={handleStream}
          loading={streamLoading}
          disabled={!videoPermissions || streamLoading}
        />
      </div>
    )
  );
}

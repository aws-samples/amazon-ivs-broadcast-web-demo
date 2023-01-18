import styles from './StreamPreview.module.css';
import Icon from '../Icon';

export default function StreamPreview({ videoPermissions, canvasRef }) {
  return (
    <div className={styles.streamPreviewContainer}>
      <div className={styles.streamPreview}>
        <canvas
          key='STREAM_PREVIEW_VIDEO'
          id='cam-video-preview'
          className={styles.streamPreviewVideo}
          ref={canvasRef}
        ></canvas>
        {videoPermissions ? (
          <></>
        ) : (
          <div className={styles.needPermissions}>
            <Icon size={'xl'}>
              <svg
                width='48'
                height='48'
                viewBox='0 0 48 48'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='m42.7 32.95-6.7-6.7v5.55l-3-3V11H15.2l-3-3H33q1.2 0 2.1.9.9.9.9 2.1v10.75l6.7-6.7q.35-.35.825-.175t.475.675v16.9q0 .5-.475.675-.475.175-.825-.175ZM41.35 45.6 2.95 7.2q-.4-.4-.4-1T3 5.15q.45-.45 1.05-.45.6 0 1.05.45l38.4 38.4q.4.4.4 1t-.45 1.05q-.45.45-1.05.45-.6 0-1.05-.45ZM24.2 20ZM7.95 8l3 3H7v26h26v-3.95l3 3V37q0 1.2-.9 2.1-.9.9-2.1.9H7q-1.2 0-2.1-.9Q4 38.2 4 37V11q0-1.2.9-2.1Q5.8 8 7 8Zm11.9 16.1Z' />
              </svg>
            </Icon>
            To start streaming, allow access to your camera and microphone
          </div>
        )}
      </div>
    </div>
  );
}

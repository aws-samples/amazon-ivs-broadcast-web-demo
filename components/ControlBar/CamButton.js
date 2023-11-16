import Button from '../Button';
import Icon from '../Icon';

export function CamButton({ muted, handleCameraMute, ...additionalProps }) {
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
            className='w-full'
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
            className='w-full'
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

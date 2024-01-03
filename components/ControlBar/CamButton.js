import { VideoCameraIcon } from '@heroicons/react/24/solid';
import { VideoCameraSlashIcon } from '@heroicons/react/24/outline';
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
          <VideoCameraIcon className='text-inherit h-6 w-6' />
        </Icon>
      ) : (
        <Icon>
          <VideoCameraSlashIcon className='text-inherit h-6 w-6' />
        </Icon>
      )}
    </Button>
  );
}

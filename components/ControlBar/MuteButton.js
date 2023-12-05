import { MicrophoneIcon } from '@heroicons/react/24/solid';
import Button from '../Button';
import Icon, { MicrophoneSlashIcon } from '@/components/Icon';

export function MuteButton({ muted, handleMicMute, ...additionalProps }) {
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
          <MicrophoneIcon className='text-inherit' />
        </Icon>
      ) : (
        <Icon>
          <MicrophoneSlashIcon className='text-inherit' />
        </Icon>
      )}
    </Button>
  );
}

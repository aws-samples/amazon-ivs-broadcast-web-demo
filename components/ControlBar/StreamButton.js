import { SignalIcon } from '@heroicons/react/20/solid';
import Button from '@/components/Button';
import Icon from '@/components/Icon';

export function StreamButton({
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
      type={buttonStyle}
      style='roundedText'
      onClick={handleStream}
      fullWidth={'responsive'}
      disabled={disabled}
      loading={loading}
      {...additionalProps}
    >
      <span className='max-sm:hidden'>{buttonContent}</span>
      <span className='sm:hidden inline-flex items-center'>
        <Icon>
          <SignalIcon className='text-inherit h-6 w-6' />
        </Icon>
      </span>
    </Button>
  );
}

import Button from '../Button';
import Icon, { ScreenShareIcon, ScreenShareSlashIcon } from '../Icon';

export function ScreenShareButton({
  active,
  handleScreenShare,
  ...additionalProps
}) {
  const buttonStyle = active ? 'positive' : 'base';
  return (
    <Button
      type={`${buttonStyle}`}
      style='round'
      onClick={handleScreenShare}
      {...additionalProps}
    >
      <Icon>
        {active ? (
          <ScreenShareSlashIcon className='text-current h-6 w-6' />
        ) : (
          <ScreenShareIcon className='text-current h-6 w-6' />
        )}
      </Icon>
    </Button>
  );
}

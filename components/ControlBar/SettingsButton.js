import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import Button from '../Button';
import Icon from '../Icon';

export function SettingsButton({ handleSettings, ...additionalProps }) {
  return (
    <Button style='round' onClick={handleSettings} {...additionalProps}>
      <Icon>
        <Cog6ToothIcon className='text-inherit h-6 w-6' />
      </Icon>
    </Button>
  );
}

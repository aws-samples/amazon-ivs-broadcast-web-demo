import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import Button from '../Button';
import Icon from '../Icon';

export function SettingsButton({ handleSettings, ...additionalProps }) {
  return (
    <Button style='round' onClick={handleSettings} {...additionalProps}>
      <Icon>
        <Cog6ToothIcon className='text-inherit' />
      </Icon>
    </Button>
  );
}

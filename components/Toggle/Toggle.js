import { Switch } from '@headlessui/react';
import { useState } from 'react';

export default function Toggle({ label, defaultValue, onChange }) {
  const [checked, setChecked] = useState(defaultValue);

  const handleChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    onChange(newChecked);
  };

  return (
    <label className='inline-flex items-center justify-start gap-2 text-sm text-uiText/50'>
      <Switch
        checked={checked}
        onChange={handleChange}
        className={`${
          checked ? 'bg-primary' : 'bg-surfaceAlt'
        } relative inline-flex h-6 w-11 items-center rounded-full ring-1 ring-inset ring-surfaceAlt2/5`}
      >
        <span className='sr-only'>{label}</span>
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition ring-1 ring-surfaceAlt2/10`}
        />
      </Switch>
      {label}
    </label>
  );
}

{
  /* <div>
  <label className={styles.checkboxLabel}>
    <input
      type='checkbox'
      className={styles.input}
      checked={checked}
      onChange={handleChange}
      {...inputProps}
    />
    {label}
  </label>
</div>; */
}

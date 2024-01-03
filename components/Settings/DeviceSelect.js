import Select from '../Select';

export function DeviceSelect({ activeDeviceId, items, name, id, onChange }) {
  return (
    <fieldset className='w-full m-0 p-0 border-0'>
      <label className='block text-sm' htmlFor={`${id}`}>{`${name}`}</label>
      <Select
        onChange={onChange}
        defaultValue={activeDeviceId}
        options={items.map(({ value, label }, i) => {
          return { value, label };
        })}
        id={`${id}`}
      />
    </fieldset>
  );
}

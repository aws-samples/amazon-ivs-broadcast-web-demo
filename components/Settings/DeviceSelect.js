import styles from './Settings.module.css';
import Select from '../Select';

export function DeviceSelect({ activeDeviceId, items, name, id, onChange }) {
  return (
    <fieldset className={styles.deviceSelectField}>
      <label
        className={styles.deviceSelectLabel}
        htmlFor={`${id}`}
      >{`${name}`}</label>
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

import styles from "./Select.module.css";
import { useState } from "react";

export default function Select({ hint, children, onChange, defaultValue, options, ...selectProps }) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    onChange(e);
    setValue(e.target.value);
  };

  return (
    <div>
      <select
        onChange={handleChange}
        className={styles.select}
        value={value}
        {...selectProps}
      >
        {options.map((item, i) => (
            <option
              key={`${i}-${item.value}`}
              value={`${item.value}`}
              disabled={item.disabled || false}
            >{`${item.label}`}</option>
          ))}
      </select>
      { hint ? 
        (<span className={styles.hint}>{hint}</span>) :
        (<></>)
      }
    </div>
  );
}

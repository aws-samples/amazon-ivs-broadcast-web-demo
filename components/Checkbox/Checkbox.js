import styles from "./Checkbox.module.css";
import { useState } from "react";

export default function Checkbox({
  label,
  defaultValue,
  onChange,
  hint,
  error,
  ...inputProps
}) {
  const [checked, setChecked] = useState(defaultValue === 'true');

  const handleChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    onChange(newChecked);
  };

  return (
    <div>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          className={styles.input}
          checked={checked}
          onChange={handleChange}
          {...inputProps}
        />
        {label}
      </label>
    </div>
  );
}

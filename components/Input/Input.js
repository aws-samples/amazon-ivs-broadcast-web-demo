import styles from "./Input.module.css";
import { useState } from "react";

export default function Input({
  children,
  onChange,
  defaultValue,
  hint,
  error,
  ...inputProps
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    onChange(e);
    setValue(e.target.value);
  };

  return (
    <div>
      <input
        onChange={handleChange}
        className={
          error ? `${styles.errorInput} ${styles.input}` : styles.input
        }
        value={value}
        {...inputProps}
      />
      {
        error ?
          (<span className={styles.errorHint}>{`${error}`}</span>) :
          (<span className={styles.hint}>{`${hint}`}</span>)
      }
    </div>
  );
}

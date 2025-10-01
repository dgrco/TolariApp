import { useEffect, useState } from "react";

interface Props {
  defaultValue: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  bind?: number | null;
  className?: string;
}

const NumberInput = ({ defaultValue, onChange, min, max, bind, className }: Props) => {
  const [value, setValue] = useState(defaultValue.toString());

  const handleChange = (e) => {
    const newValue = e.target.value;
    // Only allow numbers (including empty string)
    if (/^\d*$/.test(newValue)) {
      setValue(newValue);
    }
  };

  const handleBlur = () => {
    let newValue: number = 0;
    if (value !== '') {
      const numValue = parseInt(value, 10);
      if (min !== undefined && numValue < min) {
        newValue = min;
        setValue(min.toString());
      } else if (max !== undefined && numValue > max) {
        newValue = max;
        setValue(max.toString());
      } else {
        newValue = numValue;
      }
    } else {
      if (min !== undefined) {
        newValue = min;
        setValue(min.toString());
      }
    }
    onChange(newValue);
  };

  useEffect(() => {
    if (bind) {
      setValue(bind.toString());
    }
  }, [bind])

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  )
}

export default NumberInput;

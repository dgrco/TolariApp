import { ChangeEventHandler } from "react";
import "./dropdown.css"

// Value: the value of the selected element in the dropdown (used for processing).
// Label: the user-facing label for the value.
interface IOption {
  value: any;
  label: string;
}

interface IDropdownProps {
  default: any;
  options: IOption[];
  onChange: (selectedValue: any) => any;
}

export default function Dropdown(props: IDropdownProps) {
  return (
    <select onChange={(element: React.ChangeEvent<HTMLSelectElement>) => props.onChange(element.target.value)} defaultValue={props.default}>
      {props.options.map((option) => {
        return <option key={option.value} value={option.value}>{option.label}</option>
      })}
    </select>
  );
}

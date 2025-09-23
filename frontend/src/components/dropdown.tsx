import { ChangeEventHandler } from "react";

// Value: the value of the selected element in the dropdown (used for processing).
// Label: the user-facing label for the value.
interface IOption {
  value: any;
  label: string;
}

interface IDropdownProps {
  value: number;
  options: IOption[];
  onChange: (selectedValue: any) => any;
}

export default function Dropdown(props: IDropdownProps) {
  return (
    <div className="relative inline-block w-28">
      <select
        onChange={(element: React.ChangeEvent<HTMLSelectElement>) => props.onChange(element.target.value)}
        value={props.value}
        className="w-full p-2 pr-8 text-base bg-transparent border-2 border-border rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-800 text-gray-200">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

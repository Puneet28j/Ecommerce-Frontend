import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
}

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: DebouncedInputProps) => {
  const [value, setValue] = useState(initialValue);

  // Update internal value when initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Debounce the onChange callback
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce]);

  const handleClear = () => {
    setValue("");
    onChange("");
  };

  return (
    <div className="relative">
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search input"
        className="pr-10 " // Add padding to the right to make space for the clear button
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label="Clear input"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

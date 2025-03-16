// components/filters/debounced-input.tsx
"use client";

import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SearchFilterWithDebounceProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  icon?: React.ReactNode;
}

export const SearchFilterWithDebounce = ({
  value: initialValue,
  onChange,
  debounce = 300,
  icon,
  className,
  ...props
}: SearchFilterWithDebounceProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => setValue(initialValue), [initialValue]);
  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce);
    return () => clearTimeout(timeout);
  }, [value, debounce]);

  return (
    <div className="relative">
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn("pr-10", className)}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {icon || <X className="size-4" />}
        </button>
      )}
    </div>
  );
};

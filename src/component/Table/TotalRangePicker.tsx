// components/filters/total-range-filter.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { IndianRupee, X } from "lucide-react";
import { useState, useEffect } from "react";
import { DualRangeSlider } from "@/components/ui/dualRangeSlider";

interface TotalRangeFilterProps {
  value?: { min?: string; max?: string };
  onChange: (range: { min: string; max: string }) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

export const TotalRangeFilter = ({
  value,
  onChange,
  min = 0,
  max = 10000,
  step = 1,
  label = "Price Range",
  className,
}: TotalRangeFilterProps) => {
  const [localRange, setLocalRange] = useState([min, max]);
  const [inputValues, setInputValues] = useState({ min: "", max: "" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const minVal = value?.min ? parseInt(value.min) : min;
    const maxVal = value?.max ? parseInt(value.max) : max;
    setLocalRange([minVal, maxVal]);
    setInputValues({ min: value?.min || "", max: value?.max || "" });
  }, [value, min, max]);

  const handleApply = () => {
    onChange({
      min: inputValues.min || min.toString(),
      max: inputValues.max || max.toString(),
    });
    setOpen(false);
  };

  const handleReset = () => {
    onChange({ min: "", max: "" });
    setLocalRange([min, max]);
    setInputValues({ min: "", max: "" });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant={value?.min || value?.max ? "default" : "outline"}
          className={cn("gap-2 truncate", className)}
        >
          <IndianRupee className="size-4" />
          {value?.min || value?.max
            ? `${value.min || min} - ${value.max || max}`
            : label}
          {(value?.min || value?.max) && (
            <X className="ml-2 size-4" onClick={handleReset} />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4">
        <div className="space-y-10">
          <div className="font-medium">{label}</div>
          <DualRangeSlider
            label={(value) => value}
            labelPosition="top"
            value={localRange}
            onValueChange={(val) => {
              setLocalRange(val as [number, number]);
              setInputValues({
                min: val[0].toString(),
                max: val[1].toString(),
              });
            }}
            min={min}
            max={max}
            step={step}
          />

          <div className="flex gap-2">
            <Input
              value={inputValues.min}
              onChange={(e) =>
                setInputValues((prev) => ({
                  ...prev,
                  min: e.target.value.replace(/\D/g, ""),
                }))
              }
              placeholder={`Min (${min})`}
            />
            <Input
              value={inputValues.max}
              onChange={(e) =>
                setInputValues((prev) => ({
                  ...prev,
                  max: e.target.value.replace(/\D/g, ""),
                }))
              }
              placeholder={`Max (${max})`}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleApply}>
            Apply
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

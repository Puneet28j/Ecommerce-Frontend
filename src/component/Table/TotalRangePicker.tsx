// components/filters/total-range-filter.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { IndianRupee, X } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { DualRangeSlider } from "@/components/ui/dualRangeSlider";

interface TotalRangeFilterProps {
  value?: { min?: string; max?: string };
  onChange: (range: { min: string; max: string }) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
  currencySymbol?: React.ReactNode;
}

export const TotalRangeFilter = ({
  value = { min: "", max: "" },
  onChange,
  min = 0,
  max = 100000,
  step = 1000,
  label = "Price Range",
  className,
  currencySymbol = <IndianRupee className="w-4 h-4" />,
}: TotalRangeFilterProps) => {
  // Local state for the slider and inputs
  const [localRange, setLocalRange] = useState<[number, number]>([min, max]);
  const [inputValues, setInputValues] = useState({ min: "", max: "" });
  const [open, setOpen] = useState(false);
  const [inputErrors, setInputErrors] = useState({ min: false, max: false });
  const [hasChanges, setHasChanges] = useState(false);

  // Parse the incoming value prop
  const parsedValue = useMemo(() => {
    const minVal = value?.min && value.min !== "" ? parseInt(value.min) : null;
    const maxVal = value?.max && value.max !== "" ? parseInt(value.max) : null;
    return { min: minVal, max: maxVal };
  }, [value]);

  // Initialize local state when value prop changes
  useEffect(() => {
    const minVal = parsedValue.min ?? min;
    const maxVal = parsedValue.max ?? max;

    setLocalRange([
      Math.max(min, Math.min(max, minVal)),
      Math.max(min, Math.min(max, maxVal)),
    ]);

    setInputValues({
      min: parsedValue.min !== null ? parsedValue.min.toString() : "",
      max: parsedValue.max !== null ? parsedValue.max.toString() : "",
    });

    setHasChanges(false);
  }, [parsedValue, min, max]);

  // Format number for display
  const formatNumber = useCallback((value: number) => {
    return new Intl.NumberFormat("en-IN").format(value);
  }, []);

  // Validate input values
  const validateInputs = useCallback(
    (minVal: string, maxVal: string) => {
      const errors = { min: false, max: false };

      const numMin = minVal ? parseInt(minVal) : null;
      const numMax = maxVal ? parseInt(maxVal) : null;

      // Validate min value
      if (minVal && (isNaN(numMin!) || numMin! < min || numMin! > max)) {
        errors.min = true;
      }

      // Validate max value
      if (maxVal && (isNaN(numMax!) || numMax! < min || numMax! > max)) {
        errors.max = true;
      }

      // Validate range logic
      if (numMin !== null && numMax !== null && numMin > numMax) {
        errors.min = true;
        errors.max = true;
      }

      setInputErrors(errors);
      return !errors.min && !errors.max;
    },
    [min, max]
  );

  // Handle slider changes
  const handleSliderChange = useCallback(
    (values: number[]) => {
      const [newMin, newMax] = values;
      setLocalRange([newMin, newMax]);
      setInputValues({
        min: newMin > min ? newMin.toString() : "",
        max: newMax < max ? newMax.toString() : "",
      });
      setHasChanges(true);
      validateInputs(
        newMin > min ? newMin.toString() : "",
        newMax < max ? newMax.toString() : ""
      );
    },
    [min, max, validateInputs]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (type: "min" | "max", inputValue: string) => {
      // Allow only numbers
      const numericValue = inputValue.replace(/[^\d]/g, "");

      const newInputValues = { ...inputValues, [type]: numericValue };
      setInputValues(newInputValues);
      setHasChanges(true);

      // Update slider if valid
      if (validateInputs(newInputValues.min, newInputValues.max)) {
        const minVal = newInputValues.min
          ? Math.max(min, parseInt(newInputValues.min))
          : min;
        const maxVal = newInputValues.max
          ? Math.min(max, parseInt(newInputValues.max))
          : max;
        setLocalRange([minVal, maxVal]);
      }
    },
    [inputValues, min, max, validateInputs]
  );

  // Apply the filter
  const handleApply = useCallback(() => {
    if (!validateInputs(inputValues.min, inputValues.max)) return;

    const minVal = inputValues.min || "";
    const maxVal = inputValues.max || "";

    onChange({ min: minVal, max: maxVal });
    setOpen(false);
    setHasChanges(false);
  }, [inputValues, onChange, validateInputs]);

  // Reset the filter
  const handleReset = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }

      onChange({ min: "", max: "" });
      setLocalRange([min, max]);
      setInputValues({ min: "", max: "" });
      setInputErrors({ min: false, max: false });
      setHasChanges(false);
      setOpen(false);
    },
    [onChange, min, max]
  );

  // Cancel changes and revert
  const handleCancel = useCallback(() => {
    // Revert to original values
    const minVal = parsedValue.min ?? min;
    const maxVal = parsedValue.max ?? max;

    setLocalRange([minVal, maxVal]);
    setInputValues({
      min: parsedValue.min !== null ? parsedValue.min.toString() : "",
      max: parsedValue.max !== null ? parsedValue.max.toString() : "",
    });
    setInputErrors({ min: false, max: false });
    setHasChanges(false);
    setOpen(false);
  }, [parsedValue, min, max]);

  // Display value for the trigger button
  const displayValue = useMemo(() => {
    const hasMin = parsedValue.min !== null;
    const hasMax = parsedValue.max !== null;

    if (!hasMin && !hasMax) return label;

    const minDisplay = hasMin ? formatNumber(parsedValue.min!) : "";
    const maxDisplay = hasMax ? formatNumber(parsedValue.max!) : "";

    if (hasMin && hasMax) {
      return `${minDisplay} - ${maxDisplay}`;
    } else if (hasMin) {
      return `From ${minDisplay}`;
    } else {
      return `Up to ${maxDisplay}`;
    }
  }, [parsedValue, label, formatNumber]);

  // Check if filter is active
  const isActive = parsedValue.min !== null || parsedValue.max !== null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          className={cn(
            "gap-2 truncate h-10 justify-between min-w-[140px]",
            "hover:bg-accent hover:text-accent-foreground",
            "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
            isActive &&
              "bg-primary text-primary-foreground hover:bg-primary/90",
            className
          )}
          aria-label={`Price filter: ${displayValue}`}
        >
          <div className="flex items-center gap-2 truncate">
            {currencySymbol}
            <span className="truncate text-sm">{displayValue}</span>
          </div>
          {isActive && (
            <X
              className="h-4 w-4 shrink-0 opacity-70 hover:opacity-100"
              onClick={handleReset}
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">{label}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          </div>

          {/* Slider */}
          <div className="space-y-4">
            <DualRangeSlider
              min={min}
              max={max}
              step={step}
              value={localRange}
              onValueChange={handleSliderChange}
              className="py-4"
            />

            {/* Current range display */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatNumber(localRange[0])}</span>
              <span>{formatNumber(localRange[1])}</span>
            </div>
          </div>

          {/* Input fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="minPrice" className="text-sm font-medium">
                Minimum
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {currencySymbol}
                </div>
                <Input
                  id="minPrice"
                  type="text"
                  inputMode="numeric"
                  value={inputValues.min}
                  onChange={(e) => handleInputChange("min", e.target.value)}
                  placeholder={formatNumber(min)}
                  className={cn(
                    "pl-8 text-sm",
                    inputErrors.min &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={inputErrors.min}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPrice" className="text-sm font-medium">
                Maximum
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {currencySymbol}
                </div>
                <Input
                  id="maxPrice"
                  type="text"
                  inputMode="numeric"
                  value={inputValues.max}
                  onChange={(e) => handleInputChange("max", e.target.value)}
                  placeholder={formatNumber(max)}
                  className={cn(
                    "pl-8 text-sm",
                    inputErrors.max &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={inputErrors.max}
                />
              </div>
            </div>
          </div>

          {/* Error message */}
          {(inputErrors.min || inputErrors.max) && (
            <div className="text-destructive text-sm">
              Please enter valid values between {formatNumber(min)} and{" "}
              {formatNumber(max)}
              {inputErrors.min &&
                inputErrors.max &&
                " with minimum less than maximum"}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1"
              size="sm"
              disabled={Object.values(inputErrors).some(Boolean) || !hasChanges}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

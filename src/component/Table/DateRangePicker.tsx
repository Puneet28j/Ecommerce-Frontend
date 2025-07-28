import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  value?: { from?: string; to?: string };
  onChange: (range: { from: string; to: string }) => void;
  placeholder?: string;
  className?: string;
}

export const DateRangeFilter = ({
  value,
  onChange,
  placeholder = "Select date range",
  className,
}: DateRangePickerProps) => {
  // Convert the incoming value prop to a DateRange object.
  const parseValueToRange = (val?: {
    from?: string;
    to?: string;
  }): DateRange | undefined =>
    val?.from || val?.to
      ? {
          from: val.from ? new Date(val.from) : undefined,
          to: val.to ? new Date(val.to) : undefined,
        }
      : undefined;

  const initialRange = parseValueToRange(value);

  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    initialRange
  );
  const [tempRange, setTempRange] = useState<DateRange | undefined>(
    initialRange
  );
  const [open, setOpen] = useState(false);

  // Sync internal state when the external value changes.
  useEffect(() => {
    const newRange = parseValueToRange(value);
    setSelectedRange(newRange);
    setTempRange(newRange);
  }, [value]);

  const handleSelect = (newRange?: DateRange) => {
    setTempRange(newRange);
  };

  const applyRange = () => {
    setSelectedRange(tempRange);
    onChange({
      from: tempRange?.from ? format(tempRange.from, "yyyy-MM-dd") : "",
      to: tempRange?.to ? format(tempRange.to, "yyyy-MM-dd") : "",
    });
    setOpen(false);
  };

  const clearRange = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setTempRange(undefined);
    setSelectedRange(undefined);
    onChange({ from: "", to: "" });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedRange?.from
            ? selectedRange.to
              ? `${format(selectedRange.from, "LLL dd, y")} - ${format(
                  selectedRange.to,
                  "LLL dd, y"
                )}`
              : format(selectedRange.from, "LLL dd, y")
            : placeholder}
          {selectedRange && (
            <X
              onClick={clearRange}
              className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <Calendar mode="range" selected={tempRange} onSelect={handleSelect} />
        <div className="flex justify-end space-x-2 mt-2">
          <Button variant="ghost" size="sm" onClick={clearRange}>
            Clear All
          </Button>
          <Button variant="secondary" size="sm" onClick={applyRange}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

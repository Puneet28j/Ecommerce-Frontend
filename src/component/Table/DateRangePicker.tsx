// components/filters/date-range-picker.tsx
"use client";

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
import { useState } from "react";

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
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(
    value?.from || value?.to
      ? {
          from: value.from ? new Date(value.from) : undefined,
          to: value.to ? new Date(value.to) : undefined,
        }
      : undefined
  );

  const handleSelect = (newRange?: DateRange) => {
    setRange(newRange);
    if (!open && newRange) {
      onChange({
        from: newRange.from ? format(newRange.from, "yyyy-MM-dd") : "",
        to: newRange.to ? format(newRange.to, "yyyy-MM-dd") : "",
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            className,
            !range && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {range?.from ? (
            range.to ? (
              `${format(range.from, "LLL dd, y")} - ${format(
                range.to,
                "LLL dd, y"
              )}`
            ) : (
              format(range.from, "LLL dd, y")
            )
          ) : (
            <span>{placeholder}</span>
          )}
          {range && (
            <X
              className="ml-auto size-4 opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(undefined);
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

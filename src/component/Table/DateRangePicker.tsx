"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  initialDateFrom?: string;
  initialDateTo?: string;
  onRangeChange: (range: { from: string; to: string }) => void;
  placeholder?: string;
  triggerVariant?: Exclude<ButtonProps["variant"], "destructive" | "link">;
  triggerSize?: Exclude<ButtonProps["size"], "icon">;
  triggerClassName?: string;
}

export function DateRangePicker({
  initialDateFrom,
  initialDateTo,
  onRangeChange,
  placeholder = "Filter by date",
  triggerVariant = "outline",
  triggerSize = "default",
  triggerClassName,
  className,
  ...props
}: DateRangePickerProps) {
  const initialFrom = initialDateFrom ? new Date(initialDateFrom) : undefined;
  const initialTo = initialDateTo ? new Date(initialDateTo) : undefined;

  const initialDateRange: DateRange | undefined =
    initialFrom || initialTo ? { from: initialFrom, to: initialTo } : undefined;

  const [date, setDate] = React.useState<DateRange | undefined>(
    initialDateRange
  );
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(
    initialDateRange
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const formatDateForApi = (date: Date | undefined): string => {
      return date ? format(date, "yyyy-MM-dd") : "";
    };

    onRangeChange({
      from: formatDateForApi(date?.from),
      to: formatDateForApi(date?.to),
    });
  }, [date, onRangeChange]);

  const handleClear = () => {
    setTempDate(undefined);
    setDate(undefined);
  };

  const handleApply = () => {
    setDate(tempDate);
    setOpen(false); // Close popover after applying
  };

  return (
    <div className="grid gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={cn(
              "w-[300px] justify-between gap-2 truncate text-left font-normal",
              !date && "text-muted-foreground",
              triggerClassName
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </div>

            {date && (
              <X
                className="size-4 cursor-pointer text-muted-foreground hover:text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0", className)} {...props}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={tempDate?.from}
            selected={tempDate}
            onSelect={setTempDate}
            numberOfMonths={2}
          />
          <div className="p-3 border-t border-border flex justify-between">
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleApply}
              disabled={!tempDate?.from}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const [selectedYear, setSelectedYear] = React.useState<number>(
    date?.getFullYear() || new Date().getFullYear()
  );
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(
    date || new Date(selectedYear, 0)
  );

  // Generate years (e.g., last 100 years)
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return year;
  });

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);

    // Create a new date with the selected year but keep current month/day or use January 1st
    const newDate = date
      ? new Date(date.setFullYear(newYear))
      : new Date(newYear, 0, 1);

    // Update the calendar view
    setCalendarMonth(newDate);

    // Update the selected date if one exists
    if (date) {
      setDate(newDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

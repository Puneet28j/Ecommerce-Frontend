import React from "react";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useFilterReset } from "@/lib/hooks";
import { ActiveFilters } from "./ActiveFilters";
import { DateRangeFilter } from "./DateRangePicker";
import StatusFilter from "./StatusFilter";
import { TotalRangeFilter } from "./TotalRangePicker";
import { SearchFilterWithDebounce } from "./SearchFilterWithDebounce";

const MIN_FILTER_VALUE = 0;
const MAX_FILTER_VALUE = 100000;

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter?: string;
  onStatusChange: (value: string) => void;
  dateRange: { from: string; to: string };
  onDateChange: (range: { from: string; to: string }) => void;
  totalRange: { min: string; max: string };
  onTotalRangeChange: (range: { min: string; max: string }) => void;
  className?: string;
}

export const TableFilters: React.FC<FiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter = "all",
  onStatusChange,
  dateRange,
  onDateChange,
  totalRange,
  onTotalRangeChange,
  className,
}) => {
  const { hasActiveFilters, resetAll } = useFilterReset({
    searchQuery,
    statusFilter,
    dateRange,
    totalRange,
    resetCallbacks: {
      search: () => onSearchChange(""),
      status: () => onStatusChange("all"),
      date: () => onDateChange({ from: "", to: "" }),
      total: () => onTotalRangeChange({ min: "", max: "" }),
    },
  });

  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardContent className="p-3 sm:p-4">
        <MobileHeader hasActiveFilters={hasActiveFilters} onReset={resetAll} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 items-start">
          <SearchFilterWithDebounce
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search..."
            className="sm:col-span-2 lg:flex-1  "
          />

          <StatusFilter
            value={statusFilter}
            onChange={onStatusChange}
            className="w-full sm:w-auto"
          />

          <DateRangeFilter
            value={dateRange}
            onChange={onDateChange}
            className="w-full sm:w-auto"
          />
          <TotalRangeFilter
            value={totalRange}
            onChange={onTotalRangeChange}
            min={MIN_FILTER_VALUE}
            max={MAX_FILTER_VALUE}
            step={500}
            label="Total Range"
            currencySymbol={<span className="text-sm">₹</span>}
          />

          <DesktopResetButton
            hasActiveFilters={hasActiveFilters}
            onReset={resetAll}
          />
        </div>

        <ActiveFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          dateRange={dateRange}
          totalRange={totalRange}
          resetHandlers={{
            search: () => onSearchChange(""),
            status: () => onStatusChange("all"),
            date: () => onDateChange({ from: "", to: "" }),
            total: () => onTotalRangeChange({ min: "", max: "" }),
          }}
        />
      </CardContent>
    </Card>
  );
};

const MobileHeader: React.FC<{
  hasActiveFilters: boolean;
  onReset: () => void;
}> = ({ hasActiveFilters, onReset }) => (
  <div className="flex items-center justify-between mb-3 lg:hidden">
    <h3 className="font-medium text-sm">Filters</h3>
    <div className="flex gap-2">
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-8 gap-1 text-xs"
        >
          <X className="size-3" />
          Clear All
        </Button>
      )}
      <Button variant="outline" size="sm" className="h-8">
        <Filter className="size-4" />
      </Button>
    </div>
  </div>
);

const DesktopResetButton: React.FC<{
  hasActiveFilters: boolean;
  onReset: () => void;
}> = ({ hasActiveFilters, onReset }) =>
  hasActiveFilters && (
    <div className="hidden lg:block">
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="h-10 whitespace-nowrap"
      >
        <X className="size-4 mr-1" />
        Clear Filters
      </Button>
    </div>
  );

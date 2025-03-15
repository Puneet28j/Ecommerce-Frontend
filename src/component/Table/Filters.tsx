import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DebouncedInput } from "./debounce";
import { DateRangePicker } from "./DateRangePicker";

// components/OrdersTable/Filters.tsx
interface FiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter?: string;
  onStatusChange: (value: string) => void;
  dateRange: { from: string; to: string };
  onDateChange: (range: { from: string; to: string }) => void;
}

export const TableFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateRange,
  onDateChange,
}: FiltersProps) => (
  <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
    <DebouncedInput
      value={searchQuery}
      onChange={onSearchChange}
      placeholder="Search orders..."
      className="max-w-sm"
    />
    <Select value={statusFilter} onValueChange={onStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Order Status</SelectLabel>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Processing">Processing</SelectItem>
          <SelectItem value="Shipped">Shipped</SelectItem>
          <SelectItem value="Delivered">Delivered</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    {/* Date Range */}
    <div className="flex gap-2 items-center">
      <DateRangePicker
        initialDateFrom={dateRange.from}
        initialDateTo={dateRange.to}
        onRangeChange={onDateChange}
        placeholder="Select date range"
      />
    </div>
  </div>
);

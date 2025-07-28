// components/filters/active-filters.tsx
import { FilterChip } from "./FilterChip";

interface ActiveFiltersProps {
  searchQuery: string;
  statusFilter: string;
  dateRange: { from: string; to: string };
  totalRange: { min: string; max: string };
  resetHandlers: {
    search: () => void;
    status: () => void;
    date: () => void;
    total: () => void;
  };
}

export const ActiveFilters = ({
  searchQuery,
  statusFilter,
  dateRange,
  totalRange,
  resetHandlers,
}: ActiveFiltersProps) => {
  const hasFilters = [
    searchQuery,
    statusFilter !== "all",
    dateRange.from,
    dateRange.to,
    totalRange.min,
    totalRange.max,
  ].some(Boolean);

  if (!hasFilters) return null;

  return (
    <div className="mt-3 text-sm text-muted-foreground flex flex-wrap gap-2 items-center">
      <span className="sr-only">Active filters:</span>

      {searchQuery && (
        <FilterChip
          label="Search"
          value={searchQuery}
          onReset={resetHandlers.search}
        />
      )}

      {statusFilter !== "all" && (
        <FilterChip
          label="Status"
          value={statusFilter}
          onReset={resetHandlers.status}
        />
      )}

      {(dateRange.from || dateRange.to) && (
        <FilterChip
          label="Date"
          value={`${dateRange.from || "Any"} - ${dateRange.to || "Any"}`}
          onReset={resetHandlers.date}
        />
      )}

      {(totalRange.min || totalRange.max) && (
        <FilterChip
          label="Price"
          value={`${totalRange.min || "Min"} - ${totalRange.max || "Max"}`}
          onReset={resetHandlers.total}
        />
      )}
    </div>
  );
};

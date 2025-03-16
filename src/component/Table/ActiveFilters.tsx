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

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  searchQuery,
  statusFilter,
  dateRange,
  totalRange,
  resetHandlers,
}) => {
  const hasFilters =
    searchQuery !== "" ||
    statusFilter !== "all" ||
    dateRange.from !== "" ||
    dateRange.to !== "" ||
    totalRange.min !== "" ||
    totalRange.max !== "";

  if (!hasFilters) return null;

  return (
    <div className="mt-3 text-sm text-muted-foreground hidden sm:flex flex-wrap gap-1.5 items-center">
      <span>Active filters:</span>

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
          value={`${dateRange.from || "Any"} to ${dateRange.to || "Any"}`}
          onReset={resetHandlers.date}
        />
      )}

      {(totalRange.min || totalRange.max) && (
        <FilterChip
          label="Price"
          value={`${totalRange.min || "0"} - ${totalRange.max || "10000"}`}
          onReset={resetHandlers.total}
        />
      )}
    </div>
  );
};

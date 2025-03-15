// components/OrdersTable/TablePagination.tsx
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  totalItems?: number;
}

export const TablePagination = <TData,>({
  table,
  totalItems,
}: TablePaginationProps<TData>) => {
  // Get current pagination state
  const { pageIndex, pageSize } = table.getState().pagination;

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    table.setPageSize(newSize);
  };

  // Handle navigation with explicit state updates
  const goToNextPage = () => {
    if (table.getCanNextPage()) {
      table.setPageIndex(pageIndex + 1);
    }
  };

  const goToPreviousPage = () => {
    if (table.getCanPreviousPage()) {
      table.setPageIndex(pageIndex - 1);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-2 px-2 sm:flex-nowrap">
      {/* Info Text */}
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium">{table.getRowModel().rows.length}</span>{" "}
        of <span className="font-medium">{totalItems}</span> results
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center space-x-4 sm:space-x-6">
        {/* Rows Per Page Selector */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-9 w-[80px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Number Info */}
        <div className="flex items-center text-sm font-medium">
          Page <span className="px-1">{pageIndex + 1}</span>
          of <span className="px-1">{table.getPageCount() || 1}</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={goToPreviousPage}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={goToNextPage}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

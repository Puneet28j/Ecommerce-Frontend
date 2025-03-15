import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const paginationParams = (pagination: PaginationState) => ({
  page: pagination.pageIndex + 1, // Convert from 0-based to 1-based for API
  limit: pagination.pageSize,
});

export const sortingParams = (sorting: SortingState) => {
  if (sorting.length === 0) return {};
  const { id, desc } = sorting[0];
  return {
    sortBy: id,
    sortOrder: desc ? "desc" : "asc", // Changed from sortDir to sortOrder
  };
};

export const filterParams = (filters: ColumnFiltersState) => {
  const params: Record<string, string> = {};

  filters.forEach((filter) => {
    if (filter.id === "status" && filter.value) {
      params.status = String(filter.value);
    }
    if (filter.id === "pinCode" && filter.value) {
      params.pinCode = String(filter.value);
    }
    // Add any other filters you need to handle
  });

  return params;
};

import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { UserReducerInitialState } from "@/types/reducer-types";
import { useOrderTableState } from "@/lib/hooks";
import { Order } from "@/types/types";
import { filterParams, paginationParams, sortingParams } from "@/lib/utils";
import { orderApi } from "@/redux/api/orderAPI";
import { createColumns } from "./Column";
import { EmptyState, ErrorState, TableSkeleton } from "./TableStates";
import { TableFilters } from "./Filters";
import { TablePagination } from "./TablePagnation";

const OrdersTable = () => {
  const navigate = useNavigate();

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const {
    columnFilters,
    setColumnFilters,
    pagination,
    sorting,
    searchQuery,
    dateRange,
    totalRange,
    setPagination,
    setSorting,
    handleSearchChange,
    handleDateChange,
    handleStatusChange,
    handleTotalRangeChange,
  } = useOrderTableState();

  // Orders query params
  const orderQueryParams = useMemo(
    () => ({
      id: user?._id!,
      ...paginationParams(pagination), // Make sure this extracts pageIndex + 1 and pageSize
      ...sortingParams(sorting),
      ...filterParams(columnFilters),
      search: searchQuery,
      fromDate: dateRange.from,
      toDate: dateRange.to,
      minTotal: totalRange.min,
      maxTotal: totalRange.max,
    }),
    [
      user,
      pagination,
      sorting,
      columnFilters,
      searchQuery,
      dateRange,
      totalRange,
    ]
  );

  const { data, isLoading, isError } = orderApi.useAllOrdersQuery(
    orderQueryParams,
    {
      refetchOnMountOrArgChange: false,
    }
  );

  // Navigation handlers

  const onViewOrder = useCallback(
    (id: string) => {
      navigate(`/orders/${id}`);
    },
    [navigate]
  );

  const onEditOrder = useCallback(
    (id: string) => {
      navigate(`/orders/${id}/edit`);
    },
    [navigate]
  );

  // Column definition
  const columns = useMemo(
    () => createColumns(onViewOrder, onEditOrder),
    [onViewOrder, onEditOrder]
  );

  // Table initialization and configuration
  const table = useReactTable<Order>({
    data: data?.orders || [],
    columns,
    pageCount: data?.pagination?.totalPages || -1,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableSortingRemoval: true,
  });

  if (isError) return <ErrorState message="Error loading orders" />;

  return (
    <div className="space-y-4 m-2 font-primary">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order Management</h1>
      </div>
      <TableFilters
        totalRange={totalRange}
        onTotalRangeChange={handleTotalRangeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={
          columnFilters.find((f) => f.id === "status")?.value as string
        }
        onStatusChange={handleStatusChange}
        dateRange={dateRange}
        onDateChange={handleDateChange}
      />

      <Card className="rounded-md border overflow-hidden">
        <Table className="relative">
          <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="p-0">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton
                colCount={columns.length}
                rowCount={pagination.pageSize}
              />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <EmptyState colSpan={columns?.length} />
            )}
          </TableBody>
        </Table>
      </Card>

      <TablePagination
        table={table}
        totalItems={data?.pagination?.totalOrders}
      />
    </div>
  );
};

export default OrdersTable;

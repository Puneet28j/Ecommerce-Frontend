// src/pages/UserOrders.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import OrderItem from "../component/OrderItem";
import { useCopyOrderId, useOrderPagination } from "../lib/hooks";
import { orderApi } from "../redux/api/orderAPI";
import { RootState } from "../redux/store";
import { Order } from "../types/types";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { LoadingSpinner } from "@/component/Loader";

/**
 * PERFORMANCE PRINCIPLES APPLIED:
 * - Controlled accordion: track `openOrderId` so we mount details only when expanded
 * - Stable handlers with useCallback
 * - Memoized formatted dates
 * - Functional updates for setMyOrders (prevents unnecessary list copies)
 * - IntersectionObserver ref as callback (no recreation)
 * - Child components are memoized (see OrderItem)
 */

// Small helper typed union for status select
const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "Processing", label: "Processing" },
  { value: "Shipped", label: "Shipped" },
  { value: "Delivered", label: "Delivered" },
];

const UserOrders: React.FC = () => {
  const { user } = useSelector((s: RootState) => s.userReducer);
  const { copiedOrderId, handleCopyOrderId } = useCopyOrderId();

  // pagination
  const [page, setPage] = useState<number>(1);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  // Controlled accordion open id - ensures only 1 details component mounts at a time
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  // Reset when filters or user change
  useEffect(() => {
    setMyOrders([]);
    setPage(1);
    setHasMore(true);
    setOpenOrderId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, searchQuery, statusFilter, fromDate, toDate]);

  // memoize formatted dates so they don't change unless dependencies do
  const formattedFromDate = useMemo(
    () => (fromDate ? format(fromDate, "yyyy-MM-dd") : ""),
    [fromDate]
  );
  const formattedToDate = useMemo(
    () => (toDate ? format(toDate, "yyyy-MM-dd") : ""),
    [toDate]
  );

  // Query orders using RTK Query hook
  const queryResult = orderApi.useMyOrdersQuery(
    {
      id: user?._id!,
      page,
      limit: 10,
      search: searchQuery,
      status: statusFilter,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
    },
    { skip: !user?._id }
  );

  const { isLoading, isFetching } = useOrderPagination(
    queryResult,
    // setMyOrders appended in hook - ensure this hook uses functional updates
    setMyOrders,
    hasMore,
    setHasMore
  );

  // IntersectionObserver callback for infinite scroll
  // We keep it stable via useCallback so it doesn't re-create
  const lastOrderRef = useCallback(
    (node: HTMLDivElement | null) => {
      // If loading or fetching or no target, skip
      if (isLoading || isFetching || !node) return;

      // disconnect old observer
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      observerRef.current.observe(node);

      // cleanup handled by next call/GC
    },
    [isLoading, isFetching, hasMore]
  );

  // Stable event handlers
  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("");
    setFromDate(undefined);
    setToDate(undefined);
  }, []);

  const handleOpenOrder = useCallback((orderId: string | null) => {
    setOpenOrderId((prev) => (prev === orderId ? null : orderId));
    // optional: scrollIntoView or analytics
  }, []);

  // Loading initial spinner
  if (isLoading && page === 1) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardHeader className="px-4 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl font-bold">
            My Orders ({myOrders.length})
          </CardTitle>

          <div className="flex gap-2 w-full sm:w-auto justify-between">
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs rounded-full p-5"
            />

            <FilterSheet
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              onReset={handleResetFilters}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-4">
        {myOrders.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          // Controlled Accordion: only the expanded order's details will mount
          <Accordion
            type="single"
            collapsible
            value={openOrderId ?? undefined}
            onValueChange={(val) => handleOpenOrder(val ?? null)}
            className="w-full space-y-2"
          >
            {myOrders.map((order, index) => {
              // is last element to set intersection observer
              const isLast = index === myOrders.length - 1;
              return (
                <OrderItem
                  key={order._id}
                  order={order}
                  isLast={isLast}
                  lastOrderRef={isLast ? lastOrderRef : undefined}
                  copiedOrderId={copiedOrderId}
                  onCopyOrderId={handleCopyOrderId}
                />
              );
            })}
          </Accordion>
        )}

        {isFetching && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserOrders;

/* ----------------------
   FilterSheet & DatePicker (stable, memoized)
   small components to keep parent light
   ---------------------- */

const FilterSheet: React.FC<{
  statusFilter: string;
  onStatusChange: (s: string) => void;
  fromDate?: Date;
  toDate?: Date;
  onFromDateChange: (d?: Date) => void;
  onToDateChange: (d?: Date) => void;
  onReset: () => void;
}> = React.memo(
  ({
    statusFilter,
    onStatusChange,
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    onReset,
  }) => {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <FilterIcon size={18} />
            <span className="hidden sm:block">Filter</span>
          </Button>
        </SheetTrigger>

        <SheetContent>
          <div className="p-4">
            <div className="mb-3">
              <div className="text-sm font-medium mb-1">Status</div>
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DatePicker
              label="From Date"
              date={fromDate}
              onChange={onFromDateChange}
            />
            <DatePicker
              label="To Date"
              date={toDate}
              onChange={onToDateChange}
            />

            <div className="mt-4">
              <Button onClick={onReset}>Reset Filters</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
);

const DatePicker: React.FC<{
  label: string;
  date?: Date;
  onChange: (d?: Date) => void;
}> = React.memo(({ label, date, onChange }) => {
  return (
    <div className="flex flex-col gap-2 mb-3">
      <label className="text-sm font-medium">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => onChange(d ?? undefined)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});

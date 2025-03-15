import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { orderApi } from "../redux/api/orderAPI";
import { Order } from "../types/types";
import { useCopyOrderId, useOrderPagination } from "../lib/hooks";
import { LoadingSpinner } from "../component/Loader";
import { OrderItem } from "../component/OrderItem";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const UserOrders = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { copiedOrderId, handleCopyOrderId } = useCopyOrderId();
  const [page, setPage] = useState(1);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // Enhanced filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  // Reset pagination when filters change
  useEffect(() => {
    setMyOrders([]);
    setPage(1);
    setHasMore(true);
  }, [user?._id, searchQuery, statusFilter, fromDate, toDate]);

  // Format dates for API
  const formattedFromDate = fromDate ? format(fromDate, "yyyy-MM-dd") : "";
  const formattedToDate = toDate ? format(toDate, "yyyy-MM-dd") : "";

  // Query with filters
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
    page,
    setPage,
    myOrders,
    setMyOrders,
    hasMore,
    setHasMore
  );

  // Infinite scrolling with IntersectionObserver
  const lastOrderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetching || !node) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      observer.current.observe(node);
    },
    [isLoading, isFetching, hasMore]
  );

  // Apply filters handler
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setFromDate(undefined);
    setToDate(undefined);
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <CardHeader className="px-4 pt-6 pb-4 ">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl font-bold">
            My Orders ({myOrders.length})
          </CardTitle>

          <div className="flex gap-2 w-full sm:w-auto  justify-between ">
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs rounded-full p-5"
            />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <FilterIcon size={18} />
                  <span className=" hidden sm:block">Filter</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Orders</SheetTitle>
                  <SheetDescription>
                    Apply filters to find specific orders
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="status">Status</label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label>From Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !fromDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={fromDate}
                          onSelect={setFromDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label>To Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !toDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {toDate ? format(toDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={toDate}
                          onSelect={setToDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button onClick={handleResetFilters} className="mt-2">
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-4">
        {myOrders.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {myOrders.map((order, index) => (
              <OrderItem
                key={order._id}
                order={order}
                isLast={index === myOrders.length - 1}
                lastOrderRef={lastOrderRef}
                copiedOrderId={copiedOrderId}
                onCopyOrderId={handleCopyOrderId}
              />
            ))}
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

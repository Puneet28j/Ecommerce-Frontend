// 2. Enhanced useReviews hook (hooks/useReviews.ts)
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { reviewAPI } from "../redux/api/reviewAPI";
// hooks/useOrderTableState.ts
import { useSearchParams } from "react-router-dom";
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
// import { orderApi } from "../redux/api/orderAPI";
export const useReviews = (productId: string) => {
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetching } = reviewAPI.useGetReviewsQuery({
    productId,
    page,
    limit: 5,
  });
  // const {data}=orderApi.useMyOrdersQuery({
  //   orderId?;
  //   page?;
  //   limit?: number;
  //   id: string
  // })
  // Load more reviews when user scrolls to the bottom
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          !isFetching &&
          data?.pagination?.currentPage! < data?.pagination?.totalPages!
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [
    data?.pagination?.currentPage!,
    data?.pagination?.totalPages!,
    isFetching,
  ]);

  useEffect(() => {
    setupObserver();
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupObserver]);

  // Manual load more function (for button or fallback)
  const loadMore = useCallback(() => {
    if (
      !isFetching &&
      data?.pagination.currentPage! < data?.pagination.totalPages!
    ) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, data?.pagination]);

  return {
    reviews: data?.reviews || [],
    isLoading,
    isFetching,
    hasMore: data ? page < data?.pagination?.totalPages! : false,
    loadMore,
    loadMoreRef,
    refresh: () => setPage(1),
    pagination: data?.pagination!,
  };
};

export function useThumbnailScroll(activeIndex: number) {
  const thumbnailsContainerRef = useRef<HTMLDivElement | null>(null);

  // ALWAYS call the hook (useLayoutEffect) unconditionally.
  useLayoutEffect(() => {
    const el = thumbnailsContainerRef.current;
    if (!el) return; // check inside effect, not around the hook

    // find child by data attribute (we already added data-thumb-index)
    const selector = `[data-thumb-index='${activeIndex}']`;
    const activeEl = el.querySelector<HTMLElement>(selector);
    if (!activeEl) return;

    const containerRect = el.getBoundingClientRect();
    const childRect = activeEl.getBoundingClientRect();

    // center active child vertically inside the container
    const offset =
      childRect.top -
      containerRect.top +
      el.scrollTop -
      (containerRect.height - childRect.height) / 2;

    // prefer smooth scroll, but fall back if unsupported
    try {
      el.scrollTo({ top: offset, behavior: "smooth" });
    } catch {
      el.scrollTop = offset;
    }
  }, [activeIndex]);

  return { thumbnailsContainerRef };
}

export const useOrderPagination = (
  queryResult: any,
  // page: number,
  // setPage: React.Dispatch<React.SetStateAction<number>>,
  // orders: any[],
  setOrders: React.Dispatch<React.SetStateAction<any[]>>,
  hasMore: boolean,
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { data, isLoading, isFetching } = queryResult;

  useEffect(() => {
    if (data?.orders) {
      setOrders((prev) => [
        ...prev,
        ...data.orders.filter(
          (order: any) => !prev.some((prevOrder) => prevOrder._id === order._id)
        ),
      ]);
      setHasMore(data.pagination?.currentPage < data.pagination?.totalPages);
    }
  }, [data, setOrders, setHasMore]);

  return { isLoading, isFetching, hasMore };
};

export const useCopyOrderId = () => {
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const handleCopyOrderId = useCallback((orderId: string) => {
    navigator.clipboard.writeText(orderId).then(() => {
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 2000);
    });
  }, []);

  return { copiedOrderId, handleCopyOrderId };
};

export const useOrderTableState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse initial state from URL params
  const initialPagination: PaginationState = {
    pageIndex: parseInt(searchParams.get("page") || "1", 10) - 1,
    pageSize: parseInt(searchParams.get("size") || "10", 10),
  };

  const initialSorting: SortingState = searchParams.get("sortBy")
    ? [
        {
          id: searchParams.get("sortBy")!,
          desc: searchParams.get("sortOrder") === "desc",
        },
      ]
    : [];

  const initialFilters: ColumnFiltersState = [];
  if (searchParams.get("status")) {
    initialFilters.push({ id: "status", value: searchParams.get("status") });
  }
  if (searchParams.get("pinCode")) {
    initialFilters.push({ id: "pinCode", value: searchParams.get("pinCode") });
  }

  // State management
  const [pagination, setPaginationInternal] =
    useState<PaginationState>(initialPagination);
  const [sorting, setSortingInternal] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFiltersInternal] =
    useState<ColumnFiltersState>(initialFilters);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [dateRange, setDateRange] = useState({
    from: searchParams.get("fromDate") || "",
    to: searchParams.get("toDate") || "",
  });
  const [totalRange, setTotalRange] = useState({
    min: searchParams.get("minTotal") || "",
    max: searchParams.get("maxTotal") || "",
  });

  // Create wrapper functions to update URL params
  const setPagination = useCallback(
    (
      updaterOrValue:
        | PaginationState
        | ((prev: PaginationState) => PaginationState)
    ) => {
      setPaginationInternal(
        typeof updaterOrValue === "function"
          ? updaterOrValue
          : () => updaterOrValue
      );
    },
    []
  );

  const setSorting = useCallback(
    (updaterOrValue: SortingState | ((prev: SortingState) => SortingState)) => {
      setSortingInternal(
        typeof updaterOrValue === "function"
          ? updaterOrValue
          : () => updaterOrValue
      );

      // Reset to page 1 when sorting changes
      setPaginationInternal((prev) => ({ ...prev, pageIndex: 0 }));
    },
    []
  );

  const setColumnFilters = useCallback(
    (
      updaterOrValue:
        | ColumnFiltersState
        | ((prev: ColumnFiltersState) => ColumnFiltersState)
    ) => {
      setColumnFiltersInternal(
        typeof updaterOrValue === "function"
          ? updaterOrValue
          : () => updaterOrValue
      );

      // Reset to page 1 when filters change
      setPaginationInternal((prev) => ({ ...prev, pageIndex: 0 }));
    },
    []
  );

  // Sync state with URL params
  useEffect(() => {
    const params = new URLSearchParams();

    // Add page and size params (page is 1-indexed in URL)
    params.set("page", String(pagination.pageIndex + 1));
    params.set("size", String(pagination.pageSize));

    // Add sorting params
    if (sorting.length > 0) {
      params.set("sortBy", sorting[0].id);
      params.set("sortOrder", sorting[0].desc ? "desc" : "asc");
    }

    // Add search params
    if (searchQuery) params.set("search", searchQuery);

    // Add date range params
    if (dateRange.from) params.set("fromDate", dateRange.from);
    if (dateRange.to) params.set("toDate", dateRange.to);

    // Add total range params
    if (totalRange.min) params.set("minTotal", totalRange.min);
    if (totalRange.max) params.set("maxTotal", totalRange.max);

    // Add column filter params
    columnFilters.forEach((filter) => {
      if (filter.id === "status" && filter.value) {
        params.set("status", String(filter.value));
      }
      if (filter.id === "pinCode" && filter.value) {
        params.set("pinCode", String(filter.value));
      }
    });

    // Update the URL only if the parameters have actually changed
    const newParamsString = params.toString();
    const currentParamsString = searchParams.toString();

    if (newParamsString !== currentParamsString) {
      setSearchParams(params, { replace: true });
    }
  }, [
    pagination,
    sorting,
    columnFilters,
    searchQuery,
    dateRange,
    totalRange,
    setSearchParams,
  ]);

  // Handler functions for various state changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    // Reset to page 1 when search changes
    setPaginationInternal((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleDateChange = useCallback(
    (range: { from: string; to: string }) => {
      setDateRange(range);
      // Reset to page 1 when date range changes
      setPaginationInternal((prev) => ({ ...prev, pageIndex: 0 }));
    },
    []
  );

  const handleStatusChange = useCallback((value: string) => {
    setColumnFiltersInternal((prev) => [
      ...prev.filter((f) => f.id !== "status"),
      ...(value && value !== "all" ? [{ id: "status", value }] : []),
    ]);
    // Reset to page 1 when status filter changes
    setPaginationInternal((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleTotalRangeChange = useCallback(
    (range: { min: string; max: string }) => {
      setTotalRange(range);
      // Reset to page 1 when total range changes
      setPaginationInternal((prev) => ({ ...prev, pageIndex: 0 }));
    },
    []
  );

  return {
    pagination,
    sorting,
    columnFilters,
    searchQuery,
    dateRange,
    totalRange,
    setPagination,
    setSorting,
    setColumnFilters,
    handleSearchChange,
    handleDateChange,
    handleStatusChange,
    handleTotalRangeChange,
  };
};

export const useFilterReset = ({
  searchQuery,
  statusFilter,
  dateRange,
  totalRange,
  resetCallbacks,
}: {
  searchQuery: string;
  statusFilter: string;
  dateRange: { from: string; to: string };
  totalRange: { min: string; max: string };
  resetCallbacks: {
    search: () => void;
    status: () => void;
    date: () => void;
    total: () => void;
  };
}) => {
  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "all" ||
    dateRange.from !== "" ||
    dateRange.to !== "" ||
    totalRange.min !== "" ||
    totalRange.max !== "";

  const resetAll = () => {
    resetCallbacks.search();
    resetCallbacks.status();
    resetCallbacks.date();
    resetCallbacks.total();
  };

  return { hasActiveFilters, resetAll };
};

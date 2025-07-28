import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { productAPI } from "@/redux/api/productAPI";
import ProductCard from "./ProductCard";
import { CartItem } from "@/types/types";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/reducer/cartReducer";
import { Search, X, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SearchFilterWithDebounce } from "./Table/SearchFilterWithDebounce";
import { TotalRangeFilter } from "./Table/TotalRangePicker";

// Types for better type safety
interface SearchFilters {
  search: string;
  category: string;
  sort: string;
  minPrice: string;
  maxPrice: string;
  page: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
}

// Constants
const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "asc", label: "Price: Low to High" },
  { value: "desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
] as const;

export default function SearchPage() {
  // State management with better organization
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    category: "",
    sort: "default",
    minPrice: "",
    maxPrice: "",
    page: 1,
  });

  const dispatch = useDispatch();

  // API queries
  const { data: categoriesData, isLoading: categoriesLoading } =
    productAPI.useCategoriesQuery("");

  const {
    data,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = productAPI.useSearchProductsQuery({
    search: filters.search,
    category: filters.category,
    sort: filters.sort,
    price: filters.maxPrice, // Using maxPrice for the API's price parameter
    page: filters.page,
  });

  // Memoized data
  const products = useMemo(() => data?.products || [], [data?.products]);
  const pagination = useMemo(
    () => data?.pagination as PaginationInfo | undefined,
    [data?.pagination]
  );

  // Filter update handlers
  const updateFilter = useCallback(
    (key: keyof SearchFilters, value: string | number) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        // Reset page when filters change (except page itself)
        ...(key !== "page" && { page: 1 }),
      }));
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: "",
      category: "",
      sort: "default",
      minPrice: "",
      maxPrice: "",
      page: 1,
    });
  }, []);

  const clearIndividualFilter = useCallback(
    (filterKey: keyof SearchFilters) => {
      const defaultValues = {
        search: "",
        category: "",
        sort: "default",
        minPrice: "",
        maxPrice: "",
        page: 1,
      };
      updateFilter(filterKey, defaultValues[filterKey]);
    },
    [updateFilter]
  );

  // Cart handler
  const addToCartHandler = useCallback(
    (cartItem: CartItem): string | undefined => {
      if (cartItem.stock < 1) {
        toast.error("Out of stock");
        return "Out of stock";
      }
      dispatch(addToCart(cartItem));
      toast.success("Added to cart");
      return undefined;
    },
    [dispatch]
  );

  // Check if any filters are active
  const hasActiveFilters = useMemo(
    () =>
      filters.search ||
      filters.category ||
      filters.sort !== "default" ||
      filters.minPrice ||
      filters.maxPrice,
    [filters]
  );

  // Pagination handlers
  const goToPage = useCallback(
    (page: number) => {
      updateFilter("page", page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateFilter]
  );

  const goToPreviousPage = useCallback(() => {
    if (filters.page > 1) {
      goToPage(filters.page - 1);
    }
  }, [filters.page, goToPage]);

  const goToNextPage = useCallback(() => {
    if (pagination && filters.page < pagination.totalPages) {
      goToPage(filters.page + 1);
    }
  }, [filters.page, pagination, goToPage]);

  // Generate page numbers for pagination
  const generatePageNumbers = useMemo(() => {
    if (!pagination) return [];

    const { totalPages } = pagination;
    const currentPage = filters.page;
    const pageNumbers = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push(page);
    }

    return pageNumbers;
  }, [pagination, filters.page]);

  // Calculate display range for pagination info
  const displayRange = useMemo(() => {
    if (!pagination || products.length === 0) {
      return { start: 0, end: 0, total: 0 };
    }

    const start = (pagination.currentPage - 1) * pagination.limit + 1;
    const end = Math.min(
      pagination.currentPage * pagination.limit,
      pagination.totalOrders
    );

    return {
      start,
      end,
      total: pagination.totalOrders,
    };
  }, [pagination, products.length]);

  // Loading skeleton component
  const ProductSkeleton = () => (
    <div className="w-full max-w-[280px] mx-auto">
      <Card className="overflow-hidden">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <div className="text-center space-y-2 mb-4">
        <h3 className="text-xl font-semibold">Failed to Load Products</h3>
        <p className="text-muted-foreground max-w-md">
          We're having trouble loading the products. Please check your
          connection and try again.
        </p>
      </div>
      <Button variant="outline" onClick={refetchProducts} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <div className="text-center space-y-2 mb-4">
        <h3 className="text-xl font-semibold">No Products Found</h3>
        <p className="text-muted-foreground max-w-md">
          We couldn't find any products matching your search criteria. Try
          adjusting your filters or search terms.
        </p>
      </div>
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearAllFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  // Active filter chip component
  const FilterChip = ({
    label,
    onRemove,
  }: {
    label: string;
    onRemove: () => void;
  }) => (
    <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm flex items-center gap-2 border border-primary/20">
      <span>{label}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 hover:bg-primary/20 p-0"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Search</h1>
          <p className="text-muted-foreground mt-1">
            Discover products that match your needs
          </p>
        </div>

        {pagination && (
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>{pagination.totalOrders} total products</span>
          </div>
        )}
      </div>

      {/* Filter Section */}
      <Card className="border shadow-sm mb-6">
        <CardContent className="p-6">
          {/* Primary Filters Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-4">
            {/* Search Input */}
            <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
              <SearchFilterWithDebounce
                value={filters.search}
                onChange={(value) => updateFilter("search", value)}
                placeholder="Search products..."
                className="w-full"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={filters.category || "all"}
              onValueChange={(val) =>
                updateFilter("category", val === "all" ? "" : val)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading categories...
                  </SelectItem>
                ) : (
                  categoriesData?.categories?.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select
              value={filters.sort}
              onValueChange={(value) => updateFilter("sort", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <div className="w-full">
              <TotalRangeFilter
                value={{ min: filters.minPrice, max: filters.maxPrice }}
                onChange={({ min, max }) => {
                  updateFilter("minPrice", min);
                  updateFilter("maxPrice", max);
                }}
                min={0}
                max={100000}
                step={1000}
                label="Price Range"
                currencySymbol={<span className="text-sm">₹</span>}
              />
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="border-t pt-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Active filters:
                </span>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <FilterChip
                      label={`Search: "${filters.search}"`}
                      onRemove={() => clearIndividualFilter("search")}
                    />
                  )}
                  {filters.category && (
                    <FilterChip
                      label={`Category: ${filters.category}`}
                      onRemove={() => clearIndividualFilter("category")}
                    />
                  )}
                  {filters.sort !== "default" && (
                    <FilterChip
                      label={`Sort: ${
                        SORT_OPTIONS.find((opt) => opt.value === filters.sort)
                          ?.label
                      }`}
                      onRemove={() => clearIndividualFilter("sort")}
                    />
                  )}
                  {filters.minPrice && (
                    <FilterChip
                      label={`Min Price: ₹${filters.minPrice}`}
                      onRemove={() => clearIndividualFilter("minPrice")}
                    />
                  )}
                  {filters.maxPrice && (
                    <FilterChip
                      label={`Max Price: ₹${filters.maxPrice}`}
                      onRemove={() => clearIndividualFilter("maxPrice")}
                    />
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="space-y-6">
        {/* Loading State */}
        {productsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {productsError && <ErrorState />}

        {/* Empty State */}
        {!productsLoading && !productsError && products.length === 0 && (
          <EmptyState />
        )}

        {/* Products Grid */}
        {!productsLoading && !productsError && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="w-full max-w-[280px] mx-auto">
                  <ProductCard
                    productId={product._id}
                    {...product}
                    handler={addToCartHandler}
                    photo={[
                      {
                        url: product.photo[0]?.url || "",
                        public_id: "dummy_public_id",
                      },
                    ]}
                    reviewCount={product.reviewCount}
                    fullStars={Math.floor(product.averageRating)}
                    hasHalfStar={
                      product.averageRating -
                        Math.floor(product.averageRating) >=
                      0.5
                    }
                    emptyStars={
                      5 -
                      Math.floor(product.averageRating) -
                      (product.averageRating -
                        Math.floor(product.averageRating) >=
                      0.5
                        ? 1
                        : 0)
                    }
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
                {/* Pagination Info */}
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Showing {displayRange.start}-{displayRange.end} of{" "}
                  {displayRange.total} products
                </div>

                {/* Pagination Controls */}
                <Pagination className="order-1 sm:order-2">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={goToPreviousPage}
                        className={
                          filters.page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {generatePageNumbers.map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <Button
                          variant={
                            filters.page === pageNum ? "default" : "outline"
                          }
                          size="icon"
                          onClick={() => goToPage(pageNum)}
                          className="w-10 h-10"
                        >
                          {pageNum}
                        </Button>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={goToNextPage}
                        className={
                          filters.page === pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
// This code is a React component for a product search page that includes filtering, sorting, and pagination functionalities.
// It uses Redux for state management and integrates with a product API to fetch categories and products based on user-defined filters.

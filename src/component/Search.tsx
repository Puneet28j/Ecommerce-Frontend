import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { productAPI } from "@/redux/api/productAPI";
import { CartItem } from "@/types/types";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/reducer/cartReducer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, Search, Loader2 } from "lucide-react";
import ProductFilters from "./ProductFilters";
import ProductCard from "./ProductCard";
import { calculateStars } from "@/utils/features";

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

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    category: "",
    sort: "default",
    minPrice: "",
    maxPrice: "",
    page: 1,
  });

  const [isFilterChanging, setIsFilterChanging] = useState(false);
  const dispatch = useDispatch();

  const { data: categoriesData, isLoading: categoriesLoading } =
    productAPI.useCategoriesQuery();

  const {
    data,
    isLoading: productsLoading,
    isFetching: productsFetching,
    isError: productsError,
    refetch: refetchProducts,
  } = productAPI.useSearchProductsQuery({
    search: filters.search || undefined,
    category: filters.category || undefined,
    sort: filters.sort !== "default" ? filters.sort : undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    page: filters.page,
  });

  const products = useMemo(() => data?.products || [], [data?.products]);
  const pagination = useMemo(
    () => data?.pagination as PaginationInfo | undefined,
    [data?.pagination]
  );

  // Show filter changing state
  useEffect(() => {
    if (productsFetching && !productsLoading) {
      setIsFilterChanging(true);
    } else {
      setIsFilterChanging(false);
    }
  }, [productsFetching, productsLoading]);

  const updateFilter = useCallback(
    (key: keyof SearchFilters, value: string | number) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
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

  const addToCartHandler = useCallback(
    (cartItem: CartItem) => {
      if (cartItem.stock < 1) {
        toast.error("Out of stock");
        return;
      }
      dispatch(addToCart(cartItem));
      toast.success("Added to cart");
    },
    [dispatch]
  );

  const paginationControls = useMemo(() => {
    if (!pagination) return null;
    const { totalPages, currentPage } = pagination;
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [pagination]);

  const ProductSkeleton = () => (
    <Card className="overflow-hidden border-0 shadow-sm">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-full mt-2" />
      </CardContent>
    </Card>
  );

  const ErrorState = () => (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="h-10 w-10 text-destructive mb-3" />
        <h3 className="font-semibold mb-1">Unable to Load Products</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Something went wrong. Please try again.
        </p>
        <Button size="sm" onClick={refetchProducts} className="gap-2">
          <RefreshCw className="h-3 w-3" /> Retry
        </Button>
      </CardContent>
    </Card>
  );

  const EmptyState = () => (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4">
        <Search className="h-10 w-10 text-muted-foreground mb-3" />
        <h3 className="font-semibold mb-1">No Products Found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Try adjusting your filters to find what you're looking for
        </p>
        {(filters.search ||
          filters.category ||
          filters.minPrice ||
          filters.maxPrice) && (
          <Button size="sm" variant="outline" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-[1400px]">
        {/* Filter Bar - Sticky */}
        <div className="sticky top-20 z-50">
          <ProductFilters
            filters={filters}
            updateFilter={updateFilter}
            clearAllFilters={clearAllFilters}
            categories={categoriesData?.categories || []}
            categoriesLoading={categoriesLoading}
          />
        </div>

        {/* Loading Indicator for Filter Changes */}
        {isFilterChanging && !productsLoading && (
          <div className="flex items-center justify-center gap-2 py-4 mb-4 bg-muted/30 rounded-lg border border-border/40">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Updating results...
            </span>
          </div>
        )}

        {/* Product Results */}
        <div className="relative">
          {/* Overlay for filter changes */}
          {isFilterChanging && !productsLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 rounded-lg pointer-events-none" />
          )}

          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : productsError ? (
            <ErrorState />
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {pagination?.totalOrders || 0}{" "}
                  {pagination?.totalOrders === 1 ? "product" : "products"} found
                </p>
                {pagination && pagination.totalPages > 1 && (
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {products.map((product) => {
                  const { fullStars, hasHalfStar, emptyStars } = calculateStars(
                    product.averageRating
                  );
                  return (
                    <ProductCard
                      key={product._id}
                      {...product}
                      productId={product._id}
                      handler={addToCartHandler as any}
                      fullStars={fullStars}
                      hasHalfStar={hasHalfStar}
                      emptyStars={emptyStars}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center pt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            filters.page > 1 &&
                            updateFilter("page", filters.page - 1)
                          }
                          className={
                            filters.page === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {paginationControls?.map((num) => (
                        <PaginationItem key={num}>
                          <Button
                            size="icon"
                            variant={
                              num === filters.page ? "default" : "outline"
                            }
                            onClick={() => updateFilter("page", num)}
                            className="h-9 w-9"
                          >
                            {num}
                          </Button>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            filters.page < pagination.totalPages &&
                            updateFilter("page", filters.page + 1)
                          }
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
    </div>
  );
}

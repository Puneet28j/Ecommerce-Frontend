import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { SearchFilterWithDebounce } from "./Table/SearchFilterWithDebounce";
import { TotalRangeFilter } from "./Table/TotalRangePicker";

export interface SearchFilters {
  search: string;
  category: string;
  sort: string;
  minPrice: string;
  maxPrice: string;
  page: number;
}

interface ProductFiltersProps {
  filters: SearchFilters;
  updateFilter: (key: keyof SearchFilters, value: string | number) => void;
  clearAllFilters: () => void;
  categories: string[];
  categoriesLoading: boolean;
}

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "asc", label: "Price: Low to High" },
  { value: "desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
] as const;

export default function ProductFilters({
  filters,
  updateFilter,
  clearAllFilters,
  categories,
  categoriesLoading,
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.sort !== "default" ||
    filters.minPrice ||
    filters.maxPrice;

  const activeFilterCount = [
    filters.search,
    filters.category,
    filters.sort !== "default" ? filters.sort : "",
    filters.minPrice || filters.maxPrice ? "price" : "",
  ].filter(Boolean).length;

  const FilterChip = ({
    label,
    onRemove,
  }: {
    label: string;
    onRemove: () => void;
  }) => (
    <Badge
      variant="secondary"
      className="gap-1.5 py-0.5 px-2 text-xs flex items-center"
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 flex items-center justify-center"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );

  return (
    <div className="relative ">
      {/* Header with floating filter button */}
      <div className="flex justify-end items-center   py-2 px-2 sm:px-0">
        {/* <h1 className="text-xl sm:text-2xl font-bold">Products</h1> */}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 h-8 sm:h-9"
        >
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </div>

          {activeFilterCount > 0 && (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px] rounded-full"
            >
              {activeFilterCount}
            </Badge>
          )}

          <ChevronDown
            className={`h-3 w-3 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Animated Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="mb-4 border border-border/40 shadow-sm rounded-2xl">
              <CardContent className="p-4 sm:p-5 space-y-4">
                {/* Search, Category, Sort */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <SearchFilterWithDebounce
                      value={filters.search}
                      onChange={(val: string) => updateFilter("search", val)}
                      placeholder="Search products..."
                      className="h-9"
                    />
                  </div>

                  <Select
                    value={filters.category || "all"}
                    onValueChange={(val) =>
                      updateFilter("category", val === "all" ? "" : val)
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.sort}
                    onValueChange={(val) => updateFilter("sort", val)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TotalRangeFilter
                    value={{
                      min: filters.minPrice,
                      max: filters.maxPrice,
                    }}
                    onChange={({ min, max }) => {
                      updateFilter("minPrice", min);
                      updateFilter("maxPrice", max);
                    }}
                    min={0}
                    max={100000}
                    step={1000}
                    label="Price Range"
                    currencySymbol={<span>₹</span>}
                  />
                </div>

                {/* Active Filter Chips */}
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/60"
                  >
                    {filters.search && (
                      <FilterChip
                        label={`"${filters.search}"`}
                        onRemove={() => updateFilter("search", "")}
                      />
                    )}
                    {filters.category && (
                      <FilterChip
                        label={filters.category}
                        onRemove={() => updateFilter("category", "")}
                      />
                    )}
                    {filters.sort !== "default" && (
                      <FilterChip
                        label={
                          SORT_OPTIONS.find((opt) => opt.value === filters.sort)
                            ?.label || ""
                        }
                        onRemove={() => updateFilter("sort", "default")}
                      />
                    )}
                    {(filters.minPrice || filters.maxPrice) && (
                      <FilterChip
                        label={`₹${filters.minPrice || 0} - ₹${
                          filters.maxPrice || "∞"
                        }`}
                        onRemove={() => {
                          updateFilter("minPrice", "");
                          updateFilter("maxPrice", "");
                        }}
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-6 text-xs ml-auto"
                    >
                      Clear All
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

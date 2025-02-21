import { memo } from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { Review } from "../../redux/api/reviewAPI";
import { ReviewCard } from "./ReviewCard";

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
  hasMore: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
}

export const ReviewList = memo(
  ({
    reviews,
    loading = false,
    hasMore = false,
    loadMoreRef,
  }: ReviewListProps) => {
    if (reviews.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No reviews yet. Be the first to leave a review!
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <ol role="list" className="divide-y divide-gray-800">
          {reviews.map((review, index) => (
            <li key={review._id}>
              <ReviewCard
                review={review}
                role={index === 0 ? "listitem" : undefined}
              />
            </li>
          ))}
        </ol>

        {/* Loading indicator */}
        {loading && (
          <div className="py-4 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary"></div>
          </div>
        )}

        {/* Intersection observer target */}
        {hasMore && <div ref={loadMoreRef} className="h-10" />}
      </div>
    );
  }
);

interface ReviewListSkeletonProps {
  count?: number;
}

export const ReviewListSkeleton = ({ count = 3 }: ReviewListSkeletonProps) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

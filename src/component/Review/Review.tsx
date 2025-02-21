import { useReviews } from "../../lib/hooks";
import { ReviewForm, ReviewFormSkeleton } from "./ReviewForm";
import { ReviewList, ReviewListSkeleton } from "./ReviewsList";

interface ReviewsProps {
  productRefetch?: () => Promise<any>;
  productId: string;
}

export const Reviews: React.FC<ReviewsProps> = ({
  productRefetch,
  productId,
}) => {
  const { reviews, isLoading, isFetching, hasMore, loadMoreRef } =
    useReviews(productId);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 2xl:px-0 py-6">
      {/* Review Form */}
      {isLoading ? (
        <ReviewFormSkeleton />
      ) : (
        <ReviewForm
          reviews={reviews}
          productRefetch={productRefetch!}
          // onReviewSubmitted={refresh}
        />
      )}

      {/* Review List */}
      <h1 className="text-xl font-primary text-start mb-4">Reviews</h1>

      {isLoading && reviews.length === 0 ? (
        <ReviewListSkeleton />
      ) : (
        <ReviewList
          reviews={reviews}
          loading={isFetching}
          hasMore={hasMore}
          loadMoreRef={loadMoreRef}
        />
      )}
    </div>
  );
};

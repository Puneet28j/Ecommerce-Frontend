import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, StarIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import { reviewAPI, Review } from "../../redux/api/reviewAPI";
import { RootState } from "../../redux/store";
import { QueryResultSelectorResult } from "@reduxjs/toolkit/query";
import { Skeleton } from "../../components/ui/skeleton";

interface ReviewFormProps {
  reviews: Review[];
  productRefetch: () => Promise<QueryResultSelectorResult<any>>;
  onReviewSubmitted?: () => void; // New prop to trigger review list refresh
}
/** ⭐ Star Rating Component with Accessibility */
const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (value: number) => void;
}) => (
  <div className="flex items-center space-x-2 sm:space-x-4 my-4 justify-center">
    {[1, 2, 3, 4, 5].map((value) => (
      <button
        key={value}
        type="button"
        className="transition-transform duration-200 hover:scale-110"
        onClick={() => setRating(value)}
        aria-label={`Rate this ${value} star${value > 1 ? "s" : ""}`}
        aria-pressed={rating === value}
      >
        <StarIcon
          className={`w-8 h-8 sm:w-10 sm:h-10 ${
            rating >= value
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-300"
          }`}
        />
      </button>
    ))}
  </div>
);

export const ReviewForm: React.FC<ReviewFormProps> = ({
  reviews,
  productRefetch,
  onReviewSubmitted,
}) => {
  const { id: productId } = useParams<{ id: string }>();
  const { user } = useSelector((state: RootState) => state.userReducer);

  const existingReview = reviews?.find(
    (review) => review.user._id === user?._id
  );

  const [rating, setRating] = useState(existingReview?.rating || 1);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [submitted, setSubmitted] = useState(false);

  const [createReview, { isLoading: isCreating }] =
    reviewAPI.useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] =
    reviewAPI.useUpdateReviewMutation();

  useEffect(() => {
    if (existingReview && !submitted) {
      setRating(existingReview.rating);
      setComment(existingReview.comment || "");
    }
  }, [existingReview, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to submit a review");

    try {
      const reviewData = {
        productId: productId!,
        userId: user._id,
        rating,
        comment,
      };

      // Submit the review
      if (existingReview) {
        await updateReview(reviewData).unwrap();
      } else {
        await createReview(reviewData).unwrap();
      }

      // Update product data (ratings, review count, etc.)
      await productRefetch();

      // Reset form state
      setComment("");
      setRating(1);
      setSubmitted(true);

      // Trigger review list refresh if callback provided
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      toast.success(existingReview ? "Review updated" : "Review submitted");
    } catch (err) {
      toast.error("Failed to submit review");
      console.error("Review submission error", err);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto mb-4 border-none">
      <CardHeader>
        <h2 className="text-lg font-bold dark:text-white text-black font-primary">
          {existingReview ? "Update Your Review" : "Write a Review"}
        </h2>
      </CardHeader>
      <CardContent>
        <StarRating rating={rating} setRating={setRating} />
        <div>
          <label htmlFor="comment" className="block text-lg font-semibold mb-2">
            Your Review:
          </label>
          <Textarea
            id="comment"
            placeholder="Share your thoughts about this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full p-3 border rounded-md"
            aria-required="true"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="secondary"
          className={`w-full rounded-lg font-primary font-thin ${
            isCreating || isUpdating ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          onClick={handleSubmit}
          disabled={isCreating || isUpdating || !rating}
          aria-busy={isCreating || isUpdating}
          aria-disabled={isCreating || isUpdating}
        >
          {existingReview ? "Update Review" : "Submit Review"}
          {(isCreating || isUpdating) && (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

/** 💀 Skeleton Loading State with Accessibility */
export const ReviewFormSkeleton = () => {
  return (
    <Card className="max-w-4xl mx-auto mb-4" role="status" aria-live="polite">
      <CardHeader>
        <Skeleton className="h-6 w-40 rounded-md" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 sm:space-x-4 my-4 justify-center">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-8 w-8 rounded-full"
              aria-hidden="true"
            />
          ))}
        </div>
        <div>
          <Skeleton className="h-5 w-28 mb-2 rounded-md" aria-hidden="true" />
          <Skeleton className="h-24 w-full rounded-md" aria-hidden="true" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full rounded-lg" aria-hidden="true" />
      </CardFooter>
    </Card>
  );
};

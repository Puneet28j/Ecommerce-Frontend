// components/reviews/ReviewCard/index.tsx
import { memo } from "react";
import { Review } from "../../redux/api/reviewAPI";
import UserAvatar from "../UserAvatar";
import ReadMore from "./ReadMore";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: Review;
  role?: "listitem";
}

export const ReviewCard = memo(({ review, role }: ReviewCardProps) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const createdDate = formatDate(review.createdAt);
  const updatedDate = formatDate(review.updatedAt);

  const isEdited = review?.updatedAt !== review?.createdAt;
  return (
    <article
      role={role}
      className="group  bg-primary-foreground shadow-md p-4 hover:bg-gray-800/30 transition-colors rounded-lg"
      aria-labelledby={`review-author-${review?.user?._id}`}
    >
      <div className="flex gap-4 font-primary">
        <UserAvatar
          name={review?.user?.name}
          photo={review?.user?.photo}
          className="w-12 h-12"
        />
        <div className="flex-1 space-y-1">
          <header className="flex items-center justify-between">
            <h3
              id={`review-author-${review?.user?._id}`}
              className="font-semibold text-primary text-lg"
            >
              {review?.user?.name}
            </h3>
            <time
              dateTime={review?.updatedAt}
              className="text-sm font-thin text-gray-400 mt-1 sm:mt-0"
            >
              {isEdited ? `${updatedDate} (Edited)` : createdDate}
            </time>
          </header>
          <StarRating rating={review?.rating} />
          <ReadMore
            text={review?.comment!}
            maxLengthDesktop={80}
            maxLengthMobile={40}
          />
        </div>
      </div>
    </article>
  );
});

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1.5">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        }`}
      />
    ))}
  </div>
);

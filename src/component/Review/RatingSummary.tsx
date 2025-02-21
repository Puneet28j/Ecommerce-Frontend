import React, { memo } from "react";
import { Star } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

interface RatingSummaryProps {
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: { [key: number]: number };
  isLoading?: boolean;
}

const RatingSummary: React.FC<RatingSummaryProps> = memo(
  ({ averageRating, totalRatings, ratingBreakdown, isLoading }) => {
    const ratingLevels = [5, 4, 3, 2, 1];
    if (isLoading) {
      return <RatingSummaryLoader />;
    }
    return (
      <div className="font-sans rounded-lg bg-white dark:bg-black shadow-lg p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <RatingDisplay averageRating={averageRating} />
          <TotalRatings totalRatings={totalRatings} />
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2">
          {ratingLevels.map((rating) => (
            <RatingBar
              key={rating}
              rating={rating}
              count={ratingBreakdown[rating] || 0}
              totalRatings={totalRatings}
            />
          ))}
        </div>
      </div>
    );
  }
);

export default RatingSummary;

/**
 * Displays the average rating with a star icon.
 */
const RatingDisplay: React.FC<{ averageRating: number }> = ({
  averageRating,
}) => (
  <div className="text-center md:text-left">
    <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center justify-center md:justify-start">
      {averageRating.toFixed(1)}
      <Star className="ml-2 text-yellow-400" fill="currentColor" size={28} />
    </h2>
    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
      out of 5 stars
    </p>
  </div>
);

/**
 * Displays the total ratings count.
 */
const TotalRatings: React.FC<{ totalRatings: number }> = ({ totalRatings }) => (
  <div className="text-center md:text-right">
    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
      {formatNumber(totalRatings)}
    </p>
    <p className="text-sm text-gray-600 dark:text-gray-400">total ratings</p>
  </div>
);

/**
 * Displays an individual rating bar for each star level.
 */
const RatingBar: React.FC<{
  rating: number;
  count: number;
  totalRatings: number;
}> = ({ rating, count, totalRatings }) => {
  const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

  return (
    <div className="flex items-center">
      <span className="w-8 text-right mr-4 text-sm font-medium text-gray-600 dark:text-gray-400">
        {rating}
      </span>
      <div className="flex-grow px-4">
        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-yellow-400"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <span className="w-8 text-right ml-4 text-sm font-medium text-gray-600 dark:text-gray-400">
        {percentage}%
      </span>
    </div>
  );
};

/**
 * Formats large numbers (e.g., 1k, 1.2m).
 */
const formatNumber = (num: number): string => {
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return num.toString();
};

export const RatingSummaryLoader = () => (
  <div className="font-sans rounded-lg  shadow-lg p-6 max-w-4xl mx-auto">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <div className="text-center md:text-left">
        <Skeleton className="w-24 h-8 rounded-full opacity-100 transition-opacity duration-500 ease-in-out" />
        <Skeleton className="w-20 h-4 rounded-full mt-2 opacity-100 transition-opacity duration-500 ease-in-out" />
      </div>
      <div className="text-center md:text-right">
        <Skeleton className="w-24 h-6 rounded-full opacity-100 transition-opacity duration-500 ease-in-out" />
        <Skeleton className="w-20 h-4 rounded-full mt-2 opacity-100 transition-opacity duration-500 ease-in-out" />
      </div>
    </div>

    {/* Rating Breakdown */}
    <div className="space-y-3">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center space-y-2 mx-2">
          <Skeleton className="w-8 h-4 rounded-full opacity-100 transition-opacity duration-500 ease-in-out" />
          <div className="flex-grow px-4">
            <Skeleton className="h-4 rounded-full opacity-100 transition-opacity duration-500 ease-in-out" />
          </div>
          <Skeleton className="w-8 h-4 rounded-full opacity-100 transition-opacity duration-500 ease-in-out" />
        </div>
      ))}
    </div>
  </div>
);

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RatingSummaryProps {
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: Record<number, number>;
  isLoading?: boolean;
}

const RatingSummary: React.FC<RatingSummaryProps> = memo(
  ({ averageRating, totalRatings, ratingBreakdown, isLoading }) => {
    const ratingLevels = [5, 4, 3, 2, 1];

    if (isLoading) return <RatingSummaryLoader />;

    return (
      <TooltipProvider>
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-sans bg-white dark:bg-primary-foreground rounded-xl shadow-md p-4 sm:p-5 w-full max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
                {averageRating.toFixed(1)}
              </h2>
              <Star
                className="text-yellow-400"
                fill="currentColor"
                size={22}
                strokeWidth={1.5}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {formatNumber(totalRatings)} ratings
            </p>
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
        </motion.section>
      </TooltipProvider>
    );
  }
);

export default RatingSummary;

/* --------------------------------- Subcomponents --------------------------------- */

const RatingBar: React.FC<{
  rating: number;
  count: number;
  totalRatings: number;
}> = ({ rating, count, totalRatings }) => {
  const percentage =
    totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <span className="w-4 text-xs text-gray-700 dark:text-gray-300 text-right">
            {rating}
          </span>

          <div className="flex-grow relative h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
            />
          </div>

          <span className="w-8 text-right text-[11px] text-gray-600 dark:text-gray-400">
            {percentage}%
          </span>
        </div>
      </TooltipTrigger>

      <TooltipContent>
        <p className="text-xs font-medium">
          {count.toLocaleString()} ratings ({percentage}%)
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

/* --------------------------------- Helpers --------------------------------- */

const formatNumber = (num: number): string => {
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return num.toString();
};

/* --------------------------------- Skeleton Loader --------------------------------- */

export const RatingSummaryLoader = () => (
  <div className="font-sans rounded-xl shadow-md p-4 w-full max-w-md mx-auto bg-white dark:bg-zinc-900 space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="w-16 h-6 rounded-full" />
      <Skeleton className="w-20 h-4 rounded-full" />
    </div>
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center space-x-2">
          <Skeleton className="w-4 h-3 rounded-full" />
          <Skeleton className="flex-grow h-2.5 rounded-full" />
          <Skeleton className="w-8 h-3 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

type AnimatedBookmarkProps = {
  isBookmarked: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  isLoading?: boolean;
  size?: number;
};

const PATH_D = "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z";

const AnimatedBookmark: React.FC<AnimatedBookmarkProps> = ({
  isBookmarked,
  onClick,
  isLoading = false,
  size = 26,
}) => {
  return (
    <div className="absolute right-3 top-3 z-20">
      <motion.button
        aria-pressed={isBookmarked}
        type="button"
        onClick={!isLoading ? onClick : undefined}
        disabled={isLoading}
        className={cn(
          "relative flex items-center justify-center rounded-full p-1 focus:outline-none",
          isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        )}
        whileHover={isLoading ? {} : { scale: 1.08 }}
        whileTap={isLoading ? {} : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {/* Backdrop circle to keep icon legible on busy images */}
        <span aria-hidden className="absolute inset-0 rounded-full" />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className="relative z-10"
        >
          <AnimatePresence initial={false} mode="wait">
            {/* Inactive (unbookmarked) path: fully visible stroke, no fill.
                Shown when isBookmarked === false. */}
            {!isBookmarked && (
              <motion.path
                key="inactive"
                d={PATH_D}
                stroke="#6B7280" // tailwind gray-500; visible on light & dark
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 1, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{ fill: "rgba(0,0,0,0)" }}
              />
            )}

            {/* Active (bookmarked) path: draw (0 -> 1) then fill fades in.
                Shown when isBookmarked === true. */}
            {isBookmarked && (
              <motion.g key="active">
                {/* stroke draw */}
                <motion.path
                  d={PATH_D}
                  stroke="#b45309" // warm amber/brown stroke (visible)
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={1}
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  }}
                  style={{ fill: "rgba(0,0,0,0)" }}
                />

                {/* fill fades in slightly after the stroke completes */}
                <motion.path
                  d={PATH_D}
                  stroke="transparent"
                  initial={{ fillOpacity: 0 }}
                  animate={{ fillOpacity: 1 }}
                  transition={{ duration: 0.32, delay: 0.18, ease: "easeOut" }}
                  style={{ fill: "rgba(250,204,21,0.95)" }} // gold
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* subtle outer pulse when active */}
        <AnimatePresence>
          {isBookmarked && (
            <motion.span
              key="pulse"
              className="absolute inset-0 rounded-full pointer-events-none z-0"
              initial={{ opacity: 0.35, scale: 0.7 }}
              animate={{ opacity: 0, scale: 2.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{ background: "rgba(250,204,21,0.12)" }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default AnimatedBookmark;

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
  size = 24,
}) => {
  return (
    <div className="absolute right-2 top-2 z-20">
      <motion.button
        aria-label={isBookmarked ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={isBookmarked}
        type="button"
        onClick={!isLoading ? onClick : undefined}
        disabled={isLoading}
        className={cn(
          "relative flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 shadow-lg transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
          isLoading
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl"
        )}
        whileHover={isLoading ? {} : { scale: 1.1, y: -2 }}
        whileTap={isLoading ? {} : { scale: 0.92 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 0.5,
        }}
      >
        {/* Loading spinner overlay */}
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          className={cn(
            "relative z-10 transition-opacity",
            isLoading && "opacity-0"
          )}
        >
          <AnimatePresence initial={false} mode="wait">
            {/* Unbookmarked state */}
            {!isBookmarked && (
              <motion.g key="inactive">
                <motion.path
                  d={PATH_D}
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{ fill: "transparent" }}
                />
              </motion.g>
            )}

            {/* Bookmarked state */}
            {isBookmarked && (
              <motion.g key="active">
                {/* Animated stroke draw */}
                <motion.path
                  d={PATH_D}
                  stroke="#D97706"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: {
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  style={{ fill: "transparent" }}
                />

                {/* Fill animation */}
                <motion.path
                  d={PATH_D}
                  stroke="transparent"
                  initial={{
                    fillOpacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    fillOpacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    fillOpacity: {
                      duration: 0.4,
                      delay: 0.25,
                      ease: "easeOut",
                    },
                    scale: {
                      duration: 0.5,
                      delay: 0.2,
                      ease: [0.34, 1.56, 0.64, 1],
                    },
                  }}
                  style={{
                    fill: "#FBBF24",
                    transformOrigin: "center",
                  }}
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Enhanced pulse effect */}
        <AnimatePresence>
          {isBookmarked && !isLoading && (
            <>
              {/* Primary pulse */}
              <motion.span
                key="pulse-1"
                className="absolute inset-0 rounded-full pointer-events-none bg-amber-400/30"
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{
                  opacity: 0,
                  scale: 1.8,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />

              {/* Secondary pulse for depth */}
              <motion.span
                key="pulse-2"
                className="absolute inset-0 rounded-full pointer-events-none bg-amber-300/20"
                initial={{ opacity: 0.4, scale: 1 }}
                animate={{
                  opacity: 0,
                  scale: 2.2,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Subtle particle effect */}
        <AnimatePresence>
          {isBookmarked && !isLoading && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-amber-400"
                  initial={{
                    opacity: 0.8,
                    scale: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: 0,
                    scale: [0, 1, 0],
                    x: Math.cos((i * 120 * Math.PI) / 180) * 20,
                    y: Math.sin((i * 120 * Math.PI) / 180) * 20,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default AnimatedBookmark;

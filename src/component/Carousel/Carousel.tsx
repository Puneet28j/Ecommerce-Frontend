import { useEffect, useRef, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { CarouselSkeleton } from "../Loader";
import CarouselImage from "./CarouselImage";
import CarouselThumbnail from "./CarouselThumnail";
import DotIndicator from "./DotIndicator";
import CarouselButtons from "./CarouselButtons";
import { useThumbnailScroll } from "../../lib/hooks";

interface CarouselProps {
  images:
    | {
        url: string;
        public_id: string;
      }[]
    | undefined;
  buttonVisibility?: boolean;
  isLoading?: boolean;
  thumbnailPosition?: "left" | "bottom";
}

const Carousel = ({
  images,
  buttonVisibility = false,
  isLoading,
  thumbnailPosition = "left",
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeThumb, setActiveThumb] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchThreshold = 50;

  const { thumbnailsContainerRef } = useThumbnailScroll(activeThumb);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(
    new Array(images?.length).fill(false)
  );

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  // Consolidated resetTimer: clears any existing timer, shows controls,
  // then hides them after 5 seconds.
  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowControls(true);
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 5000);
  };

  // When currentIndex changes, reset the timer.
  useEffect(() => {
    resetTimer();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex]);

  // --- TOUCH HANDLERS (for mobile) ---
  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
    resetTimer(); // Reset timer on touch start
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    touchEndX.current = event.touches[0].clientX;
    resetTimer(); // Reset timer on touch move
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > touchThreshold) {
      deltaX > 0 ? handleNext() : handlePrev();
    }
    touchStartX.current = touchEndX.current = null;
    resetTimer(); // Reset timer after swipe
  };

  // --- ARROW HANDLERS ---
  const handlePrev = () => {
    if (!images?.length) return;
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      setActiveThumb(newIndex);
      return newIndex;
    });
    resetTimer();
  };

  const handleNext = () => {
    if (!images?.length) return;
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      setActiveThumb(newIndex);
      return newIndex;
    });
    resetTimer();
  };

  const goToSlide = (index: number) => {
    if (!images || index < 0 || index >= images.length) return;
    setCurrentIndex(index);
    setActiveThumb(index);
    resetTimer();
  };

  if (isLoading || !images?.length || !images[0].url) {
    return (
      <div className="w-full h-full aspect-square">
        <CarouselSkeleton />
      </div>
    );
  }

  return (
    <div
      ref={carouselRef}
      className="relative w-full h-full aspect-square overflow-hidden sm:rounded-lg group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => {
        setShowControls(true);
        resetTimer();
      }}
      onMouseMove={() => resetTimer()} // Reset timer on mouse move for desktop
      onMouseLeave={() => resetTimer()}
    >
      {/* Main Carousel */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <CarouselImage
            key={image.public_id}
            image={image}
            imageLoaded={imageLoaded}
            handleImageLoad={handleImageLoad}
            index={index}
            resetTimer={resetTimer} // Pass resetTimer to child for image clicks, etc.
          />
        ))}
      </div>

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Image Counter */}
        <Badge className="absolute top-4 right-6 text-center">
          {currentIndex + 1} / {images.length}
        </Badge>

        {/* Thumbnails Container with adjusted positioning and padding */}
        <div
          ref={thumbnailsContainerRef}
          className="absolute left-2  sm:left-4 top-0 bottom-0 z-10 flex flex-col gap-2 
             overflow-y-auto scrollbar-none items-center py-2 sm:py-8 px-2 sm:bg-black/20 sm:rounded-lg
             sm:my-8 my-2"
        >
          <div className="flex flex-col gap-2">
            {images.map((photo, index) => (
              <CarouselThumbnail
                key={photo.public_id}
                photo={photo}
                index={index}
                activeThumb={activeThumb}
                goToSlide={goToSlide}
              />
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {buttonVisibility && (
          <CarouselButtons handleNext={handleNext} handlePrev={handlePrev} />
        )}

        {/* Dot Indicators */}
        <div
          className={`
            absolute left-1/2 transform -translate-x-1/2 flex gap-2
            ${thumbnailPosition === "bottom" ? "bottom-4" : "bottom-6"}
          `}
        >
          {images.map((_, index) => (
            <DotIndicator
              key={index}
              index={index}
              currentIndex={currentIndex}
              goToSlide={goToSlide}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;

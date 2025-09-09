interface DotIndicatorProps {
  index: number;
  currentIndex: number;
  goToSlide: (index: number) => void;
}

const DotIndicator = ({
  index,
  currentIndex,
  goToSlide,
}: DotIndicatorProps) => {
  return (
    <button
      className={`w-2 h-2 rounded-full transition-all duration-200 ${
        index === currentIndex
          ? "bg-gray-700 scale-125"
          : "bg-gray-400 hover:bg-gray-600"
      }`}
      onClick={() => goToSlide(index)}
      aria-label={`Go to slide ${index + 1}`}
    />
  );
};

export default DotIndicator;

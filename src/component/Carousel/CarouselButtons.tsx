import { BiLeftArrow, BiRightArrow } from "react-icons/bi";

interface CarouselButtonsProps {
  handlePrev: () => void;
  handleNext: () => void;
}
const CarouselButtons = ({ handlePrev, handleNext }: CarouselButtonsProps) => {
  return (
    <>
      <button
        onClick={handlePrev}
        className="
          absolute hidden sm:flex items-center justify-center top-1/2 transform -translate-y-1/2
          bg-gray-700/80 text-white p-2 rounded-full hover:bg-gray-800 transition-colors z-30 left-6
        "
        aria-label="Previous slide"
      >
        <BiLeftArrow />
      </button>

      <button
        onClick={handleNext}
        className="
          absolute hidden sm:flex items-center justify-center top-1/2 transform -translate-y-1/2
          bg-gray-700/80 text-white p-2 rounded-full hover:bg-gray-800 transition-colors z-30 right-6
        "
        aria-label="Next slide"
      >
        <BiRightArrow />
      </button>
    </>
  );
};

export default CarouselButtons;

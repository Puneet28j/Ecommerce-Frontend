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
        className={`
              absolute hidden sm:block top-1/2 transform -translate-y-1/2 
              bg-gray-700/80 text-white p-2 rounded-full hover:bg-gray-800 
              transition-colors z-10 left-28
              
            `}
        aria-label="Previous slide"
      >
        <BiLeftArrow />
      </button>
      <button
        onClick={handleNext}
        className={`
              absolute hidden sm:block top-1/2 transform -translate-y-1/2 
              bg-gray-700/80 text-white p-2 rounded-full hover:bg-gray-800 
              transition-colors z-10
              right-28
            `}
        aria-label="Next slide"
      >
        <BiRightArrow />
      </button>
    </>
  );
};

export default CarouselButtons;

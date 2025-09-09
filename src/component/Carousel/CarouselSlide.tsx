import { cloudinaryTransform } from "@/lib/utils";

/* Inline sub-component for slide to keep code in one file (you can split it out) */
interface CarouselSlideProps {
  image: { url: string; public_id: string };
  index: number;
  isActive: boolean;
  isNeighbor: boolean;
  srcSetWidths: number[];
  lowResPlaceholder: string;
  onLoad: (index: number) => void;
  loaded: boolean;
  resetTimer: () => void;
}

export const CarouselSlide = ({
  image,
  index,
  isActive,
  isNeighbor,
  srcSetWidths,
  lowResPlaceholder,
  onLoad,
  loaded,
  resetTimer,
}: CarouselSlideProps) => {
  // build srcSet from cloudinary
  const srcSet = srcSetWidths
    .map((w) => `${cloudinaryTransform(image.url, { w })} ${w}w`)
    .join(", ");

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 relative">
      {/* low-res background placeholder */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url("${lowResPlaceholder}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />

      <img
        src={cloudinaryTransform(image.url, { w: srcSetWidths[1] })} // medium default
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
        alt={`Slide ${index + 1}`}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } sm:rounded-md`}
        loading={isActive ? "eager" : isNeighbor ? "lazy" : "lazy"}
        decoding="async"
        onLoad={() => {
          onLoad(index);
        }}
        onClick={() => {
          resetTimer();
        }}
        style={{ display: "block" }}
      />
    </div>
  );
};

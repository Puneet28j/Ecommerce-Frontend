import { cloudinaryTransform } from "@/lib/utils";
import { Skeleton } from "../../components/ui/skeleton";

interface CarouselImageProps {
  image: { url: string; public_id: string };
  index: number;
  imageLoaded: boolean[];
  handleImageLoad: (index: number) => void;
  resetTimer: () => void;
  isActive: boolean;
  isNeighbor: boolean;
  srcWidths: number[]; // e.g. [480,1024,1600]
}

const CarouselImage = ({
  image,
  index,
  imageLoaded,
  handleImageLoad,
  resetTimer,
  isActive,
  isNeighbor,
  srcWidths,
}: CarouselImageProps) => {
  // Build srcSet using provided widths.
  const srcSet = srcWidths
    .map((w) => `${cloudinaryTransform(image.url, { w })} ${w}w`)
    .join(", ");
  const lowRes = cloudinaryTransform(image.url, { w: 200, q: "auto:low" });

  // Choose loading strategy and base width
  // active -> big (eager); neighbor -> medium (lazy); others -> small/low-res (lazy)
  const loading = isActive ? "eager" : "lazy";
  const baseW = isActive
    ? srcWidths[srcWidths.length - 1]
    : isNeighbor
    ? srcWidths[1]
    : srcWidths[0];

  return (
    <div className="flex-shrink-0 w-full h-full flex items-center justify-center rounded-none relative">
      {/* low-res placeholder background while main image loads */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          imageLoaded[index] ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url("${lowRes}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />

      <img
        src={cloudinaryTransform(image.url, { w: baseW })}
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
        alt={`Slide ${index + 1}`}
        loading={loading as "lazy" | "eager"}
        decoding="async"
        className={`object-cover w-full h-full aspect-square sm:rounded-md transition-opacity duration-500 ${
          imageLoaded[index] ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => handleImageLoad(index)}
        onClick={() => resetTimer()}
      />

      {/* fallback skeleton while loading (keeps layout stable) */}
      {!imageLoaded[index] && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
      )}
    </div>
  );
};

export default CarouselImage;

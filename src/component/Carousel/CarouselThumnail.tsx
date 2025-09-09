interface CarouselThumbnailProps {
  photo: { url: string; public_id?: string };
  index: number;
  activeThumb: number;
  goToSlide: (index: number) => void;
}

const smallThumb = (url: string) =>
  url.replace("/upload/", "/upload/c_fill,h_100,w_100,q_auto:low/");

const CarouselThumbnail = ({
  photo,
  index,
  activeThumb,
  goToSlide,
}: CarouselThumbnailProps) => {
  const isActive = activeThumb === index;
  return (
    <div
      onClick={() => goToSlide(index)}
      data-thumb-index={index}
      className={`
        relative w-16 h-16 shrink-0 cursor-pointer overflow-hidden rounded-md
        transition-all duration-200
        ${
          isActive
            ? "ring-2 ring-primary ring-offset-2"
            : "opacity-60 hover:opacity-90"
        }
      `}
      role="button"
      aria-label={`Go to slide ${index + 1}`}
    >
      <img
        src={smallThumb(photo.url)}
        alt={`Thumbnail ${index + 1}`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default CarouselThumbnail;

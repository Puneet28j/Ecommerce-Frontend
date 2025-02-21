interface CarouselThumbnailProps {
  photo: { url: string };
  index: number;
  activeThumb: number;
  goToSlide: (index: number) => void;
}

const CarouselThumbnail = ({
  photo,
  index,
  activeThumb,
  goToSlide,
}: CarouselThumbnailProps) => {
  return (
    <div
      onClick={() => goToSlide(index)}
      className={`
          relative w-16 h-16 shrink-0 cursor-pointer overflow-hidden rounded-md
          transition-all duration-300
          ${
            activeThumb === index
              ? "ring-2 ring-primary ring-offset-2"
              : "opacity-50 hover:opacity-75"
          }
        `}
    >
      <img
        src={photo.url.replace(
          "/upload/",
          "/upload/c_fill,h_100,w_100,q_auto:low/"
        )}
        alt={`Thumbnail ${index + 1}`}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default CarouselThumbnail;

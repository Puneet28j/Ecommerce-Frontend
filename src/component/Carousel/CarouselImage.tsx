import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Skeleton } from "../../components/ui/skeleton";

interface CarouselImageProps {
  image: {
    url: string;
    public_id: string;
  };
  index: number;
  imageLoaded: boolean[];
  handleImageLoad: (index: number) => void;
  resetTimer: () => void;
}

const CarouselImage = ({
  image,
  imageLoaded,
  handleImageLoad,
  index,
  resetTimer,
}: CarouselImageProps) => {
  return (
    <Avatar
      key={image.public_id}
      className="flex-shrink-0 w-full h-full flex items-center justify-center rounded-none"
    >
      <AvatarImage
        className={`object-cover w-full h-full aspect-square sm:rounded-md transition-opacity duration-500 ${
          imageLoaded[index] ? "opacity-100" : "opacity-0"
        }`}
        src={image.url}
        alt={`Slide ${index + 1}`}
        onLoad={() => handleImageLoad(index)}
        onClick={() => resetTimer()}
      />
      {!imageLoaded[index] && (
        <AvatarFallback className="rounded-none">
          <Skeleton className="w-full h-full rounded-none" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default CarouselImage;

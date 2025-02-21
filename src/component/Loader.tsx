import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { cn } from "../lib/utils";

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 48,
  className,
  ...props
}: ISVGProps) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center z-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};

interface LoadingSpinner2Props extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner2: React.FC<LoadingSpinner2Props> = ({
  size = 48,
  className,
  ...props
}) => {
  return (
    <div className="flex items-center justify-center ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", className)}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};

export const ProductDescriptionLoader = () => {
  return (
    <div className="px-3 2xl:px-0 mt-6 mx-auto max-w-4xl">
      <Card>
        <Skeleton className="h-10 rounded-lg w-full" />
      </Card>
    </div>
  );
};

// export const LoadingSkeletonReviews = () => {
//   return (
//     <div className="grid grid-cols-1 mb-10 sm:grid-cols-2">
//       <div className="flex flex-col mx-auto  sm:h-[90%] sm:w-[90%] sm:rounded-lg aspect-square">
//         <Skeleton className=" aspect-square" />
//       </div>
//       <div className="flex flex-col sm:max-w-screen-lg sm:mr-8 gap-1 px-4">
//         <Skeleton className="h-9 rounded-full w-[50%]" />
//         <Skeleton className="h-6 rounded-full w-[40%]" />
//         <Skeleton className="h-6 rounded-full w-[20%] mb-1" />
//         <Skeleton className="h-6 rounded-full w-[10%]" />
//         <div className="flex space-x-4 mt-4">
//           <Skeleton className="py-2 px-4 rounded-lg h-10 w-1/6" />
//           <Skeleton className="py-2 px-4 rounded-lg h-10 w-1/6" />
//         </div>
//       </div>
//     </div>
//   );
// };

export const LoadingSkeletonRatingSummary = () => {
  return (
    <div className="font-sans rounded-lg bg-white dark:bg-black shadow-lg p-6 max-w-4xl mx-auto ">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="text-center md:text-left">
          <Skeleton className="w-20 h-8 rounded-full" />
          <Skeleton className="w-20 h-4 rounded-full mt-2" />
        </div>
        <div className="text-center md:text-right">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-20 h-4 rounded-full mt-2" />
        </div>
      </div>
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center space-y-2 mx-2">
            <Skeleton className="w-8 h-4 rounded-full" />
            <div className="flex-grow px-4">
              <Skeleton className="h-4 rounded-full" />
            </div>
            <Skeleton className="w-8 h-4 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const LoadingSkeletonDescription = () => {
  return (
    <div className="px-3 2xl:px-0 mt-6 mx-auto max-w-4xl">
      {/* <Card> */}
      <Skeleton className="h-10 rounded-lg w-full" />
      {/* </Card> */}
    </div>
  );
};

export const CarouselSkeleton = () => {
  return (
    <div className="relative w-full h-full aspect-square rounded-lg">
      {/* Main Image Skeleton */}
      <div className="w-full h-full">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>

      {/* Badge Skeleton */}
      <div className="absolute top-4 right-6">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Thumbnail Track Skeleton */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 flex flex-col space-y-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={`thumb-${index}`} className="w-16 h-16 rounded-lg" />
        ))}
      </div>

      {/* Navigation Button Skeletons */}
      <div className="hidden sm:block">
        <Skeleton className="absolute top-1/2 left-4 sm:left-16 md:left-24 transform -translate-y-1/2 w-8 h-8 rounded-full" />
        <Skeleton className="absolute top-1/2 right-4 sm:right-16 md:right-24 transform -translate-y-1/2 w-8 h-8 rounded-full" />
      </div>

      {/* Dots Skeleton */}
      <div className="absolute sm:bottom-2 bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={`dot-${index}`} className="w-3 h-3 rounded-full" />
        ))}
      </div>
    </div>
  );
};

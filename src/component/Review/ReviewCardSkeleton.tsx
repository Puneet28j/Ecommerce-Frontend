// components/LoadingWrapper.tsx

export const LoadingWrapper = ({
  isLoading,
  skeleton,
  children,
}: {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <div
      className={`transition-opacity ${
        !isLoading ? "opacity-100" : "opacity-0 absolute inset-0"
      }`}
    >
      {children}
    </div>
    {isLoading && (
      <div className="animate-pulse transition-opacity">{skeleton}</div>
    )}
  </div>
);

// Usage example:
{
  /* <LoadingWrapper
  isLoading={isLoading}
  skeleton={<ReviewListSkeleton />}
>
  <ReviewList reviews={reviews} />
</LoadingWrapper> */
}

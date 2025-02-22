// 2. Enhanced useReviews hook (hooks/useReviews.ts)
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { reviewAPI } from "../redux/api/reviewAPI";
// import { orderApi } from "../redux/api/orderAPI";

export const useReviews = (productId: string) => {
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetching } = reviewAPI.useGetReviewsQuery({
    productId,
    page,
    limit: 5,
  });
  // const {data}=orderApi.useMyOrdersQuery({
  //   orderId?;
  //   page?;
  //   limit?: number;
  //   id: string
  // })
  // Load more reviews when user scrolls to the bottom
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          !isFetching &&
          data?.pagination?.currentPage! < data?.pagination?.totalPages!
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [
    data?.pagination?.currentPage!,
    data?.pagination?.totalPages!,
    isFetching,
  ]);

  useEffect(() => {
    setupObserver();
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupObserver]);

  // Manual load more function (for button or fallback)
  const loadMore = useCallback(() => {
    if (
      !isFetching &&
      data?.pagination.currentPage! < data?.pagination.totalPages!
    ) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, data?.pagination]);

  return {
    reviews: data?.reviews || [],
    isLoading,
    isFetching,
    hasMore: data ? page < data?.pagination?.totalPages! : false,
    loadMore,
    loadMoreRef,
    refresh: () => setPage(1),
    pagination: data?.pagination!,
  };
};

export const useThumbnailScroll = (activeThumb: number) => {
  const thumbnailsContainerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const container = thumbnailsContainerRef.current;
    if (!container) return;

    const scrollToThumbnail = () => {
      const thumbnailsWrapper = container.firstElementChild;
      if (!thumbnailsWrapper) return;

      const thumbnails = Array.from(
        thumbnailsWrapper.children
      ) as HTMLElement[];
      if (!thumbnails.length) return;

      const activeElement = thumbnails[activeThumb];
      if (!activeElement) return;

      const visibleHeight = container.clientHeight;
      const thumbHeight = activeElement.offsetHeight;
      const thumbTop = activeElement.offsetTop;

      const scrollTarget = thumbTop - visibleHeight / 2 + thumbHeight / 2;
      const maxScroll = container.scrollHeight - visibleHeight;
      const finalScroll = Math.max(0, Math.min(scrollTarget, maxScroll));

      container.scrollTo({
        top: finalScroll,
        behavior: "smooth",
      });
    };

    // Use requestAnimationFrame to ensure measurements are up to date
    requestAnimationFrame(scrollToThumbnail);
  }, [activeThumb]);

  return { thumbnailsContainerRef };
};

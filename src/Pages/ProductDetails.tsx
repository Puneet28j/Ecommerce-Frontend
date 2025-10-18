import { useParams } from "react-router-dom";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { BiError } from "react-icons/bi";
import { StarIcon } from "lucide-react";

import { Button } from "../components/ui/button";
import Carousel from "../component/Carousel/Carousel";
import { DescriptionAccordion } from "../component/Review/DescriptionAccordion";
import RatingSummary from "../component/Review/RatingSummary";
import { Reviews } from "../component/Review/Review";
import { productAPI } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { UserReducerInitialState } from "../types/reducer-types";
import { CartItem, Product } from "../types/types";
import { Skeleton } from "../components/ui/skeleton";

// ─────────────────────────────────────────────────────────────
// Main ProductDetails Component
// ─────────────────────────────────────────────────────────────
const ProductDetails = memo(() => {
  const dispatch = useDispatch();
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { id: productId } = useParams();
  const { product, isLoading, isError, refetch } =
    productAPI.useProductDetailsQuery(productId ?? "", {
      skip: !productId, // Skip the query if productId is undefined
      selectFromResult: ({ data, isLoading, isFetching, isError }) => ({
        product: data?.product,
        isLoading,
        isFetching,
        isError,
      }),
    });

  if (isError) {
    throw new Error("Error while loading product details");
  }

  const inStock = (product?.stock ?? 0) > 0;

  // Calculate star rating details
  const average = product?.averageRating ?? 0;
  const fullStars = Math.floor(average);
  const hasHalfStar = average - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const ratingCount = product?.reviewCount ?? 0;
  const ratingBreakdown = product?.ratingsBreakdown ?? {};

  // Add to Cart Handler
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of stock");
    if (user?.role === "admin") {
      return toast.error("Admin cannot add to cart", {
        icon: <BiError className="h-8 w-8 text-red-500" />,
      });
    }
    dispatch(addToCart(cartItem));
    toast.success("Added to cart", {
      icon: "🛒",
      className:
        "font-primary rounded-full bg-green-600 text-white border-2 border-white",
    });
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!product) return;

    const cartItem: CartItem = {
      productId: productId!,
      photo: product.photo!,
      price: product.price!,
      stock: product.stock!,
      name: product.name!,
      quantity: 1,
    };
    addToCartHandler(cartItem);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Header Section: Always render, show skeletons when loading */}
      <ProductHeader
        product={product!}
        inStock={inStock}
        fullStars={fullStars}
        hasHalfStar={hasHalfStar}
        emptyStars={emptyStars}
        ratingCount={ratingCount}
        onAddToCart={handleButtonClick}
        isLoading={isLoading}
      />

      {/* Description Section - Always rendered */}
      <div className="px-3 2xl:px-0 mt-6 mx-auto max-w-4xl">
        <ProductDescription description={product?.description!} />
      </div>

      {/* Rating Summary - Always render, show skeletons when loading */}
      <div className="mt-6 px-3">
        <RatingSummary
          averageRating={average}
          totalRatings={ratingCount}
          ratingBreakdown={ratingBreakdown}
          isLoading={isLoading}
        />
      </div>

      {/* Reviews - Always render, show skeletons when loading */}
      <div className="mt-6">
        <Reviews productId={productId!} productRefetch={refetch} />
      </div>
    </div>
  );
});

export default ProductDetails;

// ─────────────────────────────────────────────────────────────
// Subcomponent: ProductHeader
// Combines Carousel and Product Details
// ─────────────────────────────────────────────────────────────
interface ProductHeaderProps {
  isLoading?: boolean;
  product: Product;
  inStock: boolean;
  fullStars: number;
  hasHalfStar: boolean;
  emptyStars: number;
  ratingCount: number;
  onAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// Updated ProductHeader component with full skeletons

const ProductHeader = memo(
  ({
    isLoading,
    product,
    inStock,
    fullStars,
    hasHalfStar,
    emptyStars,
    ratingCount,
    onAddToCart,
  }: ProductHeaderProps) => {
    return (
      <div className="scrollbar-thin grid grid-cols-1 font-primary mb-10 sm:grid-cols-2 gap-8">
        {/* Carousel Section */}
        <div className="relative w-full aspect-square">
          <div className={` sm:mx-auto sm:h-[90%] aspect-square `}>
            <Carousel
              buttonVisibility
              images={product?.photo}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col sm:max-w-screen-lg sm:mr-8 px-4">
          {/* Product Name & Star Rating */}
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <Skeleton className="h-9 w-3/4 rounded-full animate-pulse" />
            ) : (
              <h1 className="text-3xl font-bold text-primary">
                {product?.name}
              </h1>
            )}

            {isLoading ? (
              <Skeleton className="h-6 w-32 rounded-full animate-pulse" />
            ) : (
              <div className="flex-shrink-0">
                <StarRating
                  fullStars={fullStars}
                  hasHalfStar={hasHalfStar}
                  emptyStars={emptyStars}
                  ratingCount={ratingCount}
                />
              </div>
            )}
          </div>

          {/* Price */}
          {isLoading ? (
            <Skeleton className="h-8 w-24 rounded-full animate-pulse mt-2" />
          ) : (
            <h2 className="text-2xl font-bold text-green-600">
              ₹ {product?.price}
            </h2>
          )}

          {/* Stock Status */}
          {isLoading ? (
            <Skeleton className="h-6 w-20 rounded-full animate-pulse mt-2" />
          ) : (
            <p
              className={`text-lg font-semibold ${
                inStock ? "text-green-600" : "text-red-600"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </p>
          )}

          {/* Buttons */}
          <div className="flex space-x-4 mt-4">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-32 rounded-full animate-pulse" />
                <Skeleton className="h-10 w-32 rounded-full animate-pulse" />
              </>
            ) : (
              <>
                <Button
                  type="button"
                  className="font-bold py-2 px-4 rounded-lg"
                  disabled={!inStock}
                  onClick={onAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  type="button"
                  className="font-bold py-2 px-4 rounded-lg border border-gray-300"
                  variant="outline"
                >
                  Buy Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

// ─────────────────────────────────────────────────────────────
// Subcomponent: ProductDescription
// ─────────────────────────────────────────────────────────────
interface ProductDescriptionProps {
  description: string;
}

const ProductDescription = memo(({ description }: ProductDescriptionProps) => {
  return <DescriptionAccordion description={description} />;
});

// ─────────────────────────────────────────────────────────────
// Subcomponent: StarRating
// ─────────────────────────────────────────────────────────────

interface StarRatingProps {
  fullStars: number;
  hasHalfStar: boolean;
  emptyStars: number;
  ratingCount: number;
  className?: string;
  /**
   * Size of the star icon in pixels.
   * @default 24
   */
  size?: number;
  /**
   * Whether to show the rating count.
   * @default true
   */
  showRatingCount?: boolean;
}

export const StarRating = memo(
  ({
    fullStars,
    hasHalfStar,
    emptyStars,
    ratingCount,
    className = "",
    size = 24,
    showRatingCount = true,
  }: StarRatingProps) => {
    // Define inline style based on the provided size
    const iconStyle = { width: size, height: size };

    return (
      <div className={`flex items-center  space-x-1 ${className}`}>
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <StarIcon
              key={`full-${index}`}
              style={iconStyle}
              className="fill-yellow-500 text-yellow-500"
            />
          ))}
        {hasHalfStar && (
          <div className="relative" aria-label="Half Star" style={iconStyle}>
            <StarIcon
              style={iconStyle}
              className="absolute inset-0 text-gray-300 fill-gray-300"
            />
            <StarIcon
              style={iconStyle}
              className="absolute inset-0 text-yellow-500 fill-yellow-500 half-star-mask"
            />
          </div>
        )}

        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <StarIcon
              key={`empty-${index}`}
              style={iconStyle}
              className="fill-gray-300 text-gray-300"
            />
          ))}
        {showRatingCount && (
          <span className="ml-2 text-gray-600">({ratingCount} reviews)</span>
        )}
      </div>
    );
  }
);

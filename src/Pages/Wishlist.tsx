import { Button } from "@/components/ui/button";
import { Product } from "@/types/types";
import { BookmarkCheckIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { CardTitle } from "../components/ui/card";
import { productAPI } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { LoadingProductsSection } from "./Home";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading, isError } = productAPI.useGetWishlistQuery();

  const addToCartHandler = (cartItem: any) => {
    if (cartItem.stock < 1) return toast.error("Out of stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  const calculateStarRating = (averageRating: number) => {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return { fullStars, hasHalfStar, emptyStars };
  };

  // Error State
  if (isError) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Something went wrong
          </h2>
          <p className="text-gray-500 max-w-md">
            Failed to load your wishlist. Please check your connection and try
            again.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!isLoading && data?.wishlist?.length === 0) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="w-32 h-32 flex items-center justify-center text-gray-300">
            <BookmarkCheckIcon className="w-full h-full" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 max-w-md text-sm md:text-base">
              Looks like you haven't added anything yet. Start exploring our
              products and save your favorites for later!
            </p>
          </div>

          <Button
            onClick={() => navigate("/search")}
            size="lg"
            className="mt-2 shadow-md hover:shadow-lg transition-all"
          >
            Browse Products →
          </Button>
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="font-bold text-2xl md:text-3xl">
            Your Wishlist
          </CardTitle>
          {!isLoading && data?.wishlist && (
            <p className="text-sm text-gray-500 mt-1">
              {data.wishlist.length}{" "}
              {data.wishlist.length === 1 ? "item" : "items"} saved
            </p>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <LoadingProductsSection />
      ) : (
        // Products Grid
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {data?.wishlist.map((product: Product) => {
            const { fullStars, hasHalfStar, emptyStars } = calculateStarRating(
              product.averageRating
            );

            return (
              <ProductCard
                key={product._id}
                productId={product._id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                handler={addToCartHandler}
                photo={product.photo}
                reviewCount={product.reviewCount}
                fullStars={fullStars}
                hasHalfStar={hasHalfStar}
                emptyStars={emptyStars}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

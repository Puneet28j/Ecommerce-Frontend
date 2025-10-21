import { productAPI } from "@/redux/api/productAPI";
import { setWishlist } from "@/redux/reducer/wishlistReducer";
import React from "react";
import toast from "react-hot-toast";
import { BiError } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { StarRating } from "../Pages/ProductDetails";
import { UserReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import AnimatedBookmark from "./AnimatedBookmark";

type ProductsProps = {
  productId: string;
  photo: { url: string; public_id: string }[];
  name: string;
  price: number;
  stock: number;
  reviewCount: number;
  fullStars: number;
  hasHalfStar: boolean;
  emptyStars: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  photo,
  price,
  stock,
  name,
  handler,
  reviewCount,
  fullStars,
  hasHalfStar,
  emptyStars,
}: ProductsProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const wishlistIds = useSelector((state: any) => state.wishlist.ids);

  const [wishlistToggle, { isLoading }] =
    productAPI.useWishlistToggleMutation();

  const isBookmarked = wishlistIds.includes(productId);
  const LOW_STOCK_LIMIT = 5;

  const handleViewProduct = () => navigate(`/product/${productId}`);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (user?.role === "admin")
      return showErrorToast("Admin cannot add to cart");
    if (!user) return showErrorToast("Login First");
    handler({ productId, photo, price, stock, name, quantity: 1 });
  };

  const handleBookmarkToggle = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!user) return showErrorToast("Login First");

    try {
      const res = await wishlistToggle({ productId }).unwrap();
      dispatch(setWishlist(res.wishlistIds));

      toast.success(
        res.action === "added"
          ? "Added to Wishlist ❤️"
          : "Removed from Wishlist ❌"
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const showErrorToast = (message: string) =>
    toast.error(message, {
      icon: <BiError className="h-6 w-6 text-red-500" />,
      className:
        "font-primary rounded-lg bg-background text-foreground border-2",
    });

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Card
      onClick={handleViewProduct}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border bg-white dark:bg-gray-900 shadow-sm transition hover:shadow-lg cursor-pointer"
    >
      {/* Image Container - Compact aspect ratio */}
      <div className="relative aspect-square w-full flex-shrink-0 overflow-hidden">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={photo[0].url.replace(
            "/upload/",
            "/upload/c_fill,h_300,w_300,q_auto,f_auto/"
          )}
          alt={name}
          loading="lazy"
        />

        {/* Stock Badge */}
        <div className="absolute left-2 top-2 z-10">
          {stock === 0 && (
            <span className="rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] text-white font-medium shadow-sm">
              Out of Stock
            </span>
          )}
          {stock > 0 && stock <= LOW_STOCK_LIMIT && (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] text-white font-medium shadow-sm">
              {stock} left
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        <AnimatedBookmark
          isBookmarked={isBookmarked}
          onClick={handleBookmarkToggle}
          isLoading={isLoading}
        />
      </div>

      {/* Content Container - Compact and efficient */}
      <div className="flex flex-1 flex-col p-3">
        {/* Product Name - Compact with fixed height */}
        <h3 className="line-clamp-2 min-h-[1.5rem] text-xs font-semibold text-gray-900 dark:text-white leading-tight mb-2">
          {name}
        </h3>

        {/* Spacer */}
        <div className="flex-1 min-h-[4px]" />

        {/* Rating - Compact */}
        <div className="mb-2">
          <StarRating
            fullStars={fullStars}
            hasHalfStar={hasHalfStar}
            emptyStars={emptyStars}
            ratingCount={reviewCount}
            size={12}
            compact={true} // Shows: "4.5 (156)"
          />
        </div>

        {/* Price - Full width, separate line */}
        <p className="text-base font-bold text-primary mb-2 truncate">
          {formattedPrice}
        </p>

        {/* Add to Cart Button - Compact */}
        {stock > 0 && (
          <Button
            onClick={handleAddToCart}
            variant="default"
            size="sm"
            disabled={isLoading}
            className="w-full h-8 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition"
          >
            Add to Cart
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;

import { Bookmark } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CartItem } from "../types/types";
import { UserReducerInitialState } from "../types/reducer-types";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { BiError } from "react-icons/bi";
import { cn } from "../lib/utils";
import { StarRating } from "../Pages/ProductDetails";
import { productAPI } from "@/redux/api/productAPI";
import { setWishlist } from "@/redux/reducer/wishlistReducer";

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

  const handleBookmarkToggle = async (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    if (!user) return showErrorToast("Login First");

    try {
      const res = await wishlistToggle({ productId }).unwrap();

      // ✅ Use backend response to set Redux store
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
      className="group relative h-full overflow-hidden rounded-2xl border bg-white dark:bg-gray-900 shadow-md transition hover:shadow-xl cursor-pointer"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={photo[0].url.replace(
            "/upload/",
            "/upload/c_fill,h_300,w_300,q_auto,f_auto/"
          )}
          alt={name}
          loading="lazy"
        />

        <div className="absolute left-3 top-3 z-10">
          {stock === 0 && (
            <span className="rounded-full bg-red-500/90 px-3 py-1 text-xs text-white font-medium">
              Out of Stock
            </span>
          )}
          {stock > 0 && stock <= LOW_STOCK_LIMIT && (
            <span className="rounded-full bg-amber-500 px-3 py-1 text-xs text-white font-medium">
              Only {stock} left
            </span>
          )}
        </div>

        <Bookmark
          onClick={handleBookmarkToggle}
          className={cn(
            "absolute right-3 top-3 z-20 h-6 w-6 cursor-pointer transition-colors",
            isBookmarked
              ? "fill-yellow-400 stroke-yellow-500 hover:fill-yellow-300"
              : "stroke-gray-400 fill-transparent hover:fill-gray-200"
          )}
        />
      </div>

      <CardContent className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
          {name}
        </h3>

        <div className="mt-3 sm:flex items-center justify-between">
          <StarRating
            fullStars={fullStars}
            hasHalfStar={hasHalfStar}
            emptyStars={emptyStars}
            ratingCount={reviewCount}
            size={14}
            showRatingCount={false}
          />
          <p className="text-lg font-bold text-primary">{formattedPrice}</p>
        </div>
      </CardContent>

      {stock > 0 && (
        <div className="px-4 pb-4">
          <Button
            onClick={handleAddToCart}
            variant="default"
            size="sm"
            disabled={isLoading}
            className="w-full rounded-lg font-medium shadow-sm hover:shadow-md transition"
          >
            Add to Cart
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ProductCard;

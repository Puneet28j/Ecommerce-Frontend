import { Bookmark } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CartItem } from "../types/types";
import { UserReducerInitialState } from "../types/reducer-types";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { BiError } from "react-icons/bi";
import { cn } from "../lib/utils";
import { StarRating } from "../Pages/ProductDetails";

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
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const LOW_STOCK_LIMIT = 5;

  const handleViewProduct = () => navigate(`/product/${productId}`);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (user?.role === "admin") {
      return showErrorToast("Admin cannot add to cart");
    }
    if (!user) {
      return showErrorToast("Login First");
    }
    handler({ productId, photo, price, stock, name, quantity: 1 });
  };

  const handleBookmarkToggle = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setIsBookmarked((prev) => !prev);
    // TODO: Persist bookmark state
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
    <div className="group relative w-64 overflow-hidden font-primary">
      <Card
        onClick={handleViewProduct}
        className="h-full cursor-pointer transition-transform duration-300 hover:shadow-lg"
      >
        <CardContent className="relative p-2">
          {/* Bookmark Button */}
          <Bookmark
            onClick={handleBookmarkToggle}
            className={cn(
              "absolute right-3 top-3 z-20 h-6 w-6 cursor-pointer transition-colors",
              isBookmarked
                ? "fill-yellow-400 stroke-yellow-500 hover:fill-yellow-300"
                : "stroke-gray-400 fill-transparent hover:fill-gray-200"
            )}
          />

          {/* Stock Status */}
          <div className="absolute left-2 top-2 z-10 space-y-1">
            {stock === 0 && (
              <div className="rounded-full bg-destructive px-3 py-1 text-xs text-destructive-foreground">
                Out of Stock
              </div>
            )}
            {stock > 0 && stock <= LOW_STOCK_LIMIT && (
              <div className="rounded-full bg-amber-500 px-3 py-1 text-xs text-amber-50">
                Only {stock} left
              </div>
            )}
          </div>

          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <img
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={photo[0].url.replace(
                "/upload/",
                "/upload/c_fill,h_300,w_300,q_auto,f_auto/"
              )}
              alt={name}
              loading="lazy"
            />
          </div>

          {/* Product Info */}
          <div className="mt-4 px-2">
            {/* Product Title */}
            <h3 className="line-clamp-2 text-sm font-medium leading-tight">
              {name}
            </h3>
            {/* Price and Rating Row */}
            <div className="mt-2 flex items-center justify-between">
              <p className="text-lg font-bold text-primary">{formattedPrice}</p>
              <StarRating
                fullStars={fullStars}
                hasHalfStar={hasHalfStar}
                emptyStars={emptyStars}
                ratingCount={reviewCount}
                size={14}
                className="ml-2"
                showRatingCount={false}
              />
            </div>
          </div>
        </CardContent>

        {/* Add to Cart Button */}
        {stock > 0 && (
          <div className="p-2">
            <Button
              onClick={handleAddToCart}
              variant="secondary"
              size="sm"
              className="w-full transition-transform duration-300 group-hover:scale-105"
            >
              Add to Cart
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductCard;

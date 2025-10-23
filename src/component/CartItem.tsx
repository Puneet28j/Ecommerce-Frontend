import { Minus, Plus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { CartItem } from "../types/types";
import { useNavigate } from "react-router-dom";

type CartItemProps = {
  cartItem: CartItem;
  incrementHandler: (cartItem: CartItem) => void;
  decrementHandler: (cartItem: CartItem) => void;
  removeHandler: (id: string) => void;
};

const CartItemCard = ({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: CartItemProps) => {
  const { productId, name, price, photo, quantity, stock } = cartItem;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${productId}`);
  };

  // Cloudinary optimization URL function
  const getOptimizedImage = (url: string, width = 150, height = 150) => {
    if (!url) return "";
    // Replace "upload/" with transformations
    return url.replace(
      "/upload/",
      `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex items-center p-1 sm:p-4 m-4 bg-white dark:bg-black text-black dark:text-white rounded-lg shadow-md cursor-pointer"
    >
      <div className="relative">
        <Avatar className="h-24 w-24 overflow-hidden rounded-md">
          <AvatarImage
            src={getOptimizedImage(photo[0].url, 150, 150)}
            alt={name}
            className="object-contain object-center aspect-square border rounded-md"
            loading="lazy"
          />
          <AvatarFallback className="rounded-md">CN</AvatarFallback>
        </Avatar>
        {quantity >= stock && (
          <p className="absolute bottom-[0.3rem] bg-slate-500 text-white font-extralight left-0 w-full text-xs text-center truncate">
            Limit reached
          </p>
        )}
      </div>
      <div className="ml-4 flex flex-col flex-1 overflow-hidden">
        <h3 className="text-sm sm:text-lg truncate font-bold">{name}</h3>
        <p className="text-sm text-gray-600">INR {price}</p>
        <div className="flex items-center mt-2">
          <span className="text-sm text-gray-500">Quantity:</span>
          <div
            className="ml-2 flex items-center border rounded-lg px-3 sm:px-5 gap-3 py-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => decrementHandler(cartItem)}
              disabled={quantity <= 1}
              className={`text-xl font-bold ${
                quantity <= 1
                  ? "dark:text-gray-600 text-gray-400 cursor-not-allowed"
                  : "dark:text-gray-400 text-black"
              }`}
            >
              <Minus size={16} />
            </button>
            <span className="w-5 text-center text-md">{quantity}</span>
            <button
              onClick={() => incrementHandler(cartItem)}
              disabled={quantity >= stock}
              className={`text-lg font-bold ${
                quantity >= stock
                  ? "dark:text-gray-600 text-gray-400 cursor-not-allowed"
                  : "dark:text-gray-400 text-black"
              }`}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeHandler(productId);
        }}
        className="ml-4 hover:text-gray-200 dark:hover:text-slate-500 dark:text-white text-black"
      >
        <X />
      </button>
    </div>
  );
};

export default CartItemCard;

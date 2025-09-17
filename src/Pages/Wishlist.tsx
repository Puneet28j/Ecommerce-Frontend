import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import ProductCard from "../component/ProductCard";
import { CardTitle } from "../components/ui/card";
import { productAPI } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { LoadingProductsSection } from "./Home";

const Wishlist = () => {
  const dispatch = useDispatch();

  const { data, isLoading, isError } = productAPI.useGetWishlistQuery();

  const addToCartHandler = (cartItem: any) => {
    if (cartItem.stock < 1) return toast.error("Out of stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  // if (isLoading)
  //   return (
  //     <div className="max-w-7xl mx-auto">
  //       <LoadingProductsSection />
  //     </div>
  //   );

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <p className="text-red-500 font-medium">
          Failed to load your wishlist. Please try again.
        </p>
      </div>
    );
  }

  if (data?.wishlist?.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <p className="border py-2 px-4 rounded-sm text-gray-600">
          Your wishlist is empty ❤️
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Heading always visible */}
      <CardTitle className="font-bold text-3xl text-left">
        Your Wishlist
      </CardTitle>

      {/* Loading or grid */}
      {isLoading ? (
        <LoadingProductsSection />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data?.wishlist.map((product) => (
            <ProductCard
              key={product._id}
              productId={product._id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              handler={addToCartHandler}
              photo={product.photo}
              reviewCount={product.reviewCount}
              fullStars={Math.floor(product.averageRating)}
              hasHalfStar={
                product.averageRating - Math.floor(product.averageRating) >= 0.5
              }
              emptyStars={
                5 -
                Math.floor(product.averageRating) -
                (product.averageRating - Math.floor(product.averageRating) >=
                0.5
                  ? 1
                  : 0)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

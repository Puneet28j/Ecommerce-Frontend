import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import ProductCard from "../component/ProductCard";
import { CardFooter, CardTitle } from "../components/ui/card";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { productAPI } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import { Skeleton } from "../components/ui/skeleton";

const Home = () => {
  const dispatch = useDispatch();
  const { data, isError, isLoading } = productAPI.useLatestProductsQuery("");

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) {
    toast.error("Failed to load products");
    return;
  }

  return (
    <div className="container px-0 mt-10 font-primary">
      <CardTitle className="hidden sm:block font-extrabold text-6xl md:text-5xl tracking-wide text-center mb-8">
        Ecommerce
      </CardTitle>

      <CardFooter className="px-4 sm:px-6">
        <CardTitle className="font-extrabold text-2xl lg:text-3xl">
          Latest Products
        </CardTitle>
      </CardFooter>

      <ScrollArea className="w-full rounded-md shadow-sm">
        <div className="py-4">
          {isLoading ? (
            <LoadingProductsSection />
          ) : (
            <div className="flex space-x-4 px-4 pb-4">
              {data?.products?.map((i) => (
                <ProductCard
                  key={i._id}
                  productId={i._id}
                  name={i.name}
                  price={i.price}
                  stock={i.stock}
                  handler={addToCartHandler}
                  photo={i.photo}
                  reviewCount={i.reviewCount}
                  fullStars={Math.floor(i.averageRating)}
                  hasHalfStar={
                    i.averageRating - Math.floor(i.averageRating) >= 0.5
                  }
                  emptyStars={
                    5 -
                    Math.floor(i.averageRating) -
                    (i.averageRating - Math.floor(i.averageRating) >= 0.5
                      ? 1
                      : 0)
                  }
                />
              ))}
            </div>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Home;

const LoadingSkeletonProductCard = () => (
  <div className="w-64 space-y-4 rounded-lg bg-background p-4 shadow-sm">
    <Skeleton className="h-48 w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4 rounded-full" />
    <Skeleton className="h-4 w-1/2 rounded-full" />
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export const LoadingProductsSection = () => (
  <div className="flex space-x-4 px-4 pb-4">
    {[1, 2, 3, 4].map((index) => (
      <LoadingSkeletonProductCard key={index} />
    ))}
  </div>
);

import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import { CardTitle } from "../components/ui/card";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { Skeleton } from "../components/ui/skeleton";
import { productAPI } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import { BiRightArrow } from "react-icons/bi";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isError, isLoading } = productAPI.useLatestProductsQuery();
  const { data: FeaturedProducts, isLoading: FeaturedIsLoading } =
    productAPI.useFeaturedQuery();
  const { data: BestSellingProducts, isLoading: BestSellingIsLoading } =
    productAPI.useBestSellingQuery();
  const { data: BudgetProducts, isLoading: BudgetIsLoading } =
    productAPI.useBudgetQuery();
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };
  console.log("BestSellingProducts", BestSellingProducts);
  console.log("FeaturedProducts", FeaturedProducts);
  console.log("BudgetProducts", BudgetProducts);
  console.log("data", data);

  if (isError) {
    toast.error("Failed to load products");
    return;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-12">
      <section className="relative  dark:text-black bg-gradient-to-r from-primary to-primary/70 text-white rounded-2xl p-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Shop Smarter
        </h1>
        <p className="text-lg opacity-90 font-primary mb-6">
          Discover premium products at unbeatable prices
        </p>
        <button
          onClick={() => navigate("/search")}
          className="bg-white dark:bg-gray-900 flex items-center gap-1 shadow-sm shadow-gray-400  text-primary font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition"
        >
          Start Shopping <BiRightArrow />
        </button>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <CardTitle className="font-bold text-2xl lg:text-3xl">
            Latest Products
          </CardTitle>
          <button
            onClick={() => navigate("/search")}
            className="text-primary hover:underline"
          >
            View All →
          </button>
        </div>

        <ScrollArea className="w-full">
          <div className="py-4">
            {isLoading ? (
              <LoadingProductsSection />
            ) : (
              <div className="flex gap-2  pb-4">
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
          <ScrollBar orientation="horizontal" className="bg-secondary/20" />
        </ScrollArea>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <CardTitle className="font-bold text-2xl lg:text-3xl">
            Bestselling Products
          </CardTitle>
          <button
            onClick={() => navigate("/search")}
            className="text-primary hover:underline"
          >
            View All →
          </button>
        </div>

        <ScrollArea className="w-full">
          <div className="py-4">
            {BestSellingIsLoading ? (
              <LoadingProductsSection />
            ) : (
              <div className="flex gap-2  pb-4">
                {BestSellingProducts?.products?.map((i) => (
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
          <ScrollBar orientation="horizontal" className="bg-secondary/20" />
        </ScrollArea>
      </section>
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <CardTitle className="font-bold text-2xl lg:text-3xl">
            Featured Products
          </CardTitle>
          <button
            onClick={() => navigate("/search")}
            className="text-primary hover:underline"
          >
            View All →
          </button>
        </div>

        <ScrollArea className="w-full">
          <div className="py-4">
            {FeaturedIsLoading ? (
              <LoadingProductsSection />
            ) : (
              <div className="flex gap-2 pb-4">
                {FeaturedProducts?.products?.map((i) => (
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
          <ScrollBar orientation="horizontal" className="bg-secondary/20" />
        </ScrollArea>
      </section>
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <CardTitle className="font-bold text-2xl lg:text-3xl">
            Budget Products
          </CardTitle>
          <button
            onClick={() => navigate("/search")}
            className="text-primary hover:underline"
          >
            View All →
          </button>
        </div>

        <ScrollArea className="w-full">
          <div className="py-4">
            {BudgetIsLoading ? (
              <LoadingProductsSection />
            ) : (
              <div className="flex gap-2  pb-4">
                {BudgetProducts?.products?.map((i) => (
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
          <ScrollBar orientation="horizontal" className="bg-secondary/20" />
        </ScrollArea>
      </section>
    </div>
  );
};

export default Home;

export const LoadingSkeletonProductCard = () => (
  <div className="group relative h-full w-full rounded-2xl border bg-card shadow-md animate-pulse">
    {/* Image */}
    <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl">
      <Skeleton className="h-full w-full rounded-t-2xl" />
      {/* Stock badge */}
      <Skeleton className="absolute left-3 top-3 h-5 w-16 rounded-full" />
      {/* Bookmark icon */}
      <Skeleton className="absolute right-3 top-3 h-6 w-6 rounded-full" />
    </div>

    {/* Content */}
    <div className="mt-3 space-y-2 p-4">
      <Skeleton className="h-5 w-3/4 rounded-full" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/2 rounded-full" />
        <Skeleton className="h-4 w-1/4 rounded-full" />
      </div>
    </div>

    {/* Add to cart button */}
    <div className="px-4 pb-4">
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

export const LoadingProductsSection = () => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 pb-4">
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <LoadingSkeletonProductCard key={index} />
    ))}
  </div>
);

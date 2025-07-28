import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import ProductCard from "../component/ProductCard";
import { CardTitle } from "../components/ui/card";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { productAPI } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import { Skeleton } from "../components/ui/skeleton";

const Home = () => {
  const dispatch = useDispatch();
  const { data, isError, isLoading } = productAPI.useLatestProductsQuery("");
  const { data: FeaturedProducts, isLoading: FeaturedIsLoading } =
    productAPI.useFeaturedQuery("");
  const { data: BestSellingProducts, isLoading: BestSellingIsLoading } =
    productAPI.useBestSellingQuery("");
  const { data: BudgetProducts, isLoading: BudgetIsLoading } =
    productAPI.useBudgetQuery("");
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
      <header className="text-center space-y-4">
        <CardTitle className="hidden sm:block font-extrabold text-5xl md:text-6xl tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Ecommerce
        </CardTitle>
        <p className="text-muted-foreground text-lg">
          Discover amazing products at great prices
        </p>
      </header>

      <section className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <CardTitle className="font-bold text-2xl lg:text-3xl">
            Latest Products
          </CardTitle>
          <button className="text-primary hover:underline">View All →</button>
        </div>

        <ScrollArea className="w-full">
          <div className="py-4">
            {isLoading ? (
              <LoadingProductsSection />
            ) : (
              <div className="flex gap-2 px-2 pb-4">
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
          <button className="text-primary hover:underline">View All →</button>
        </div>

        <ScrollArea className="w-full">
          <div className="py-4">
            {BestSellingIsLoading ? (
              <LoadingProductsSection />
            ) : (
              <div className="flex gap-6 px-2 pb-4">
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
          <button className="text-primary hover:underline">View All →</button>
        </div>

        <ScrollArea className="w-full">
          <div className="py-4">
            {FeaturedIsLoading ? (
              <LoadingProductsSection />
            ) : (
              <div className="flex gap-6 px-2 pb-4">
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
          <button className="text-primary hover:underline">View All →</button>
        </div>

        <ScrollArea className="w-full">
          <div className="py-4">
            {BudgetIsLoading ? (
              <LoadingProductsSection />
            ) : (
              <div className="flex gap-6 px-2 pb-4">
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

const LoadingSkeletonProductCard = () => (
  <div className="w-72 space-y-4 rounded-xl bg-card p-4 shadow-md">
    <Skeleton className="h-52 w-full rounded-lg" />
    <Skeleton className="h-5 w-3/4 rounded-full" />
    <Skeleton className="h-4 w-1/2 rounded-full" />
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export const LoadingProductsSection = () => (
  <div className="flex gap-4 px-2 pb-4">
    {[1, 2, 3, 4].map((index) => (
      <div className="flex-none" key={index}>
        <LoadingSkeletonProductCard />
      </div>
    ))}
  </div>
);

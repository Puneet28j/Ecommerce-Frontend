import { productAPI } from "@/redux/api/productAPI";
import { setWishlist, clearWishlist } from "@/redux/reducer/wishlistReducer";
import { UserReducerInitialState } from "@/types/reducer-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const WishlistSync = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  // Only fetch when user exists
  const { data } = productAPI.useGetWishlistQuery(undefined, {
    skip: !user, // Skip query if no user
    refetchOnMountOrArgChange: true, // Always refetch when component mounts or args change
  });

  useEffect(() => {
    if (user && data?.wishlist) {
      // User is logged in and we have wishlist data
      const wishlistIds = data.wishlist.map((product: any) => product._id);
      dispatch(setWishlist(wishlistIds));
    } else if (!user) {
      // User logged out, clear wishlist
      dispatch(clearWishlist());
    }
  }, [user, data, dispatch]);

  return null; // This component doesn't render anything
};

export default WishlistSync;

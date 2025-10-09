import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { getUser } from "./redux/api/userAPI";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { clearWishlist } from "./redux/reducer/wishlistReducer";
import AppRoutes from "./AppRoutes";
import WishlistSync from "./hooks/wishlistSync";
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Subscribe to Firebase Auth State changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const data = await getUser(user?.uid);
          if (data?.user) {
            dispatch(userExist(data?.user));
            // ✅ WishlistSync component will handle fetching
          } else {
            dispatch(userNotExist());
            dispatch(clearWishlist());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch(userNotExist());
          dispatch(clearWishlist());
        }
      } else {
        dispatch(userNotExist());
        dispatch(clearWishlist()); // ✅ Clear on logout
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <WishlistSync /> {/* ✅ Add this component */}
      <AppRoutes />
    </>
  );
};

export default AppContent;

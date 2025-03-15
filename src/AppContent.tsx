import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { getUser } from "./redux/api/userAPI";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import AppRoutes from "./AppRoutes";

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
          } else {
            dispatch(userNotExist());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch(userNotExist());
        }
      } else {
        dispatch(userNotExist());
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return <AppRoutes />;
};

export default AppContent;

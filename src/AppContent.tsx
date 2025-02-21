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
    // Listen to Firebase Auth State Change
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);
        dispatch(userExist(data?.user));
      } else {
        dispatch(userNotExist());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <AppRoutes />;
};

export default AppContent;

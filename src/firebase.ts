import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQFGYVdLXdMLloHWcWuTHtEEqPdLSaRI8",
  authDomain: "mern-2-2cddb.firebaseapp.com",
  projectId: "mern-2-2cddb",
  storageBucket: "mern-2-2cddb.appspot.com",
  messagingSenderId: "981860995621",
  appId: "1:981860995621:web:356b5c7fd7cf2b98dea5cc",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

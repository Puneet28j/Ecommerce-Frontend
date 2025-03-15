import { useNavigate } from "react-router-dom";
import { IoIosFingerPrint } from "react-icons/io";
import { User } from "../../types/types";
import BreadCrumb from "../BreadCrumb";
import { ModeToggle } from "../ModeToggle";
import UserAvatar from "../UserAvatar";
import { motion } from "framer-motion";
interface PropsType {
  user: User | null;
  loading: boolean;
}

const Header = ({ user, loading }: PropsType) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b justify-between bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="hidden sm:block sm:ml-10">
        <BreadCrumb />
      </div>
      <div className="block sm:hidden">
        <ModeToggle />
      </div>
      <div className="sm:hidden flex items-center">
        {loading ? (
          // Skeleton Loader with Animation
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-10 w-10 rounded-full bg-gray-700 animate-pulse"
          />
        ) : !user?._id ? (
          <button onClick={() => navigate("/login")}>
            <IoIosFingerPrint className="h-10 w-10 cursor-pointer text-gray-400 hover:text-gray-300 transition-all" />
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <UserAvatar
              moreInfo
              email={user.email}
              name={user.name}
              photo={user.photo}
            />
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;

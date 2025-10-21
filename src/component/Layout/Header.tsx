import { motion } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
import { IoIosFingerPrint } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../../types/types";
import BreadCrumb from "../BreadCrumb";
import UserAvatar from "../UserAvatar";

interface PropsType {
  user: User | null;
  loading: boolean;
}

const Header = ({ user, loading }: PropsType) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate(-1);
  };

  const isHomePage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {/* Breadcrumb (desktop only) */}
      <div className="hidden sm:block sm:ml-10">
        <BreadCrumb />
      </div>

      {/* Left icons (mobile) */}
      <div className="flex items-center gap-3 sm:hidden">
        {/* Show back arrow only if not home */}
        {!isHomePage && (
          <ArrowLeftIcon
            onClick={goBack}
            className="size-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:scale-110 transition-transform"
          />
        )}
      </div>

      {/* Right section (mobile user / login / loader) */}
      <div className="sm:hidden flex items-center">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-10 w-10 rounded-full bg-gray-700 animate-pulse"
          />
        ) : !user?._id ? (
          <button onClick={() => navigate("/login")}>
            <IoIosFingerPrint className="h-8 w-8 cursor-pointer text-gray-400 hover:text-gray-300 transition-all" />
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
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

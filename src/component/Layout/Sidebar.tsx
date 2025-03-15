import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import NavItem from "./NavItem";
import { ModeToggle } from "../ModeToggle";
import { motion } from "framer-motion";
import { Separator } from "../../components/ui/separator";
import { User } from "../../types/types";
import UserAvatar from "../UserAvatar";

// Icon Imports (common)
import { GoHomeFill, GoHome } from "react-icons/go";
import { Search } from "lucide-react";
import { RiShoppingBag4Fill, RiShoppingBag4Line } from "react-icons/ri";
import { IoGift, IoGiftOutline } from "react-icons/io5";

// Icon Imports (admin)
import {
  MdSpaceDashboard,
  MdOutlineSpaceDashboard,
  MdOutlineAnalytics,
} from "react-icons/md";
import {
  ListOrderedIcon,
  LucideShoppingBasket,
  LucideLayoutDashboard,
} from "lucide-react";
import { BiLogoProductHunt } from "react-icons/bi";
import { UserCheck, UserCheck2Icon } from "lucide-react";

// Other icons
import { IoIosAnalytics, IoIosFingerPrint } from "react-icons/io";

interface PropsType {
  user: User | null;
  loading: boolean;
}

const Sidebar = ({ user, loading }: PropsType) => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);

  // Define common navigation items
  const commonNavItems = [
    {
      path: "/",
      activeIcon: <GoHomeFill className="w-8 h-8" />,
      inactiveIcon: <GoHome className="w-8 h-8" />,
    },
    {
      path: "/search",
      activeIcon: (
        <Search strokeWidth={3} absoluteStrokeWidth className="w-8 h-8" />
      ),
      inactiveIcon: <Search className="w-8 h-8" />,
    },
    {
      path: "/cart",
      activeIcon: <RiShoppingBag4Fill className="w-8 h-8" />,
      inactiveIcon: <RiShoppingBag4Line className="w-8 h-8" />,
      badgeCount: cartItems.length,
    },
    {
      path: "/orders",
      activeIcon: <IoGift className="w-8 h-8" />,
      inactiveIcon: <IoGiftOutline className="w-8 h-8" />,
    },
  ];

  // Define admin navigation items
  const adminNavItems = [
    {
      path: "/admin/dashboard",
      activeIcon: <MdSpaceDashboard className="w-8 h-8" />,
      inactiveIcon: <MdOutlineSpaceDashboard className="w-8 h-8" />,
    },
    {
      path: "/admin/orders",
      activeIcon: <ListOrderedIcon className="w-8 h-8" />,
      inactiveIcon: <LucideShoppingBasket className="w-8 h-8" />,
    },
    {
      path: "/admin/products",
      activeIcon: <BiLogoProductHunt className="w-8 h-8" />,
      inactiveIcon: <LucideLayoutDashboard className="w-8 h-8" />,
    },
    {
      path: "/admin/customers",
      activeIcon: <UserCheck2Icon className="w-8 h-8" />,
      inactiveIcon: <UserCheck className="w-8 h-8" />,
    },
    {
      path: "/admin/analytics",
      activeIcon: <IoIosAnalytics strokeWidth={3} className="w-8 h-8" />,
      inactiveIcon: <MdOutlineAnalytics className="w-8 h-8" />,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-0 px-2 sm:py-5 space-y-5">
        {commonNavItems.map(
          ({ path, activeIcon, inactiveIcon, badgeCount }) => (
            <NavItem
              key={path}
              to={path}
              iconActive={activeIcon}
              iconInactive={inactiveIcon}
              badgeCount={badgeCount}
            />
          )
        )}

        {/* Render admin nav items only for admin users */}
        {user?.role === "admin" && (
          <>
            <Separator />
            {adminNavItems.map(({ path, activeIcon, inactiveIcon }) => (
              <NavItem
                key={path}
                to={path}
                iconActive={activeIcon}
                iconInactive={inactiveIcon}
              />
            ))}
          </>
        )}
      </nav>

      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <ModeToggle />

        {loading ? (
          // Animated Skeleton Loader
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
      </nav>
    </aside>
  );
};

export default Sidebar;

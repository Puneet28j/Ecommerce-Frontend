import { motion } from "framer-motion";
import { IoIosFingerPrint } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { User } from "../../types/types";
import { ModeToggle } from "../ModeToggle";
import UserAvatar from "../UserAvatar";
import NavItem from "./NavItem";

// Icons
import {
  BarChart3Icon,
  Bookmark,
  BookmarkCheck,
  HomeIcon,
  LayoutDashboardIcon,
  PackageIcon,
  PackageOpenIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TagsIcon
} from "lucide-react";

interface PropsType {
  user: User | null;
  loading: boolean;
}

// ✅ Define a consistent interface for all nav items
interface NavItemType {
  path: string;
  activeIcon: JSX.Element;
  inactiveIcon: JSX.Element;
  badge?: "cart" | "wishlist"; // optional, only for specific user routes
}

// ✅ User routes
const USER_NAV_ITEMS: NavItemType[] = [
  {
    path: "/",
    activeIcon: <HomeIcon strokeWidth={2.5} className="w-6 h-6" />,
    inactiveIcon: <HomeIcon strokeWidth={1.5} className="w-6 h-6" />,
  },
  {
    path: "/search",
    activeIcon: <SearchIcon strokeWidth={2.5} className="w-6 h-6" />,
    inactiveIcon: <SearchIcon strokeWidth={1.5} className="w-6 h-6" />,
  },
  {
    path: "/cart",
    activeIcon: <ShoppingBagIcon strokeWidth={2.5} className="w-6 h-6" />,
    inactiveIcon: <ShoppingBagIcon strokeWidth={1.5} className="w-6 h-6" />,
    badge: "cart",
  },
  {
    path: "/wishlist",
    activeIcon: <BookmarkCheck strokeWidth={2.5} className="w-6 h-6" />,
    inactiveIcon: <Bookmark strokeWidth={1.5} className="w-6 h-6" />,
    badge: "wishlist",
  },
  {
    path: "/orders",
    activeIcon: <PackageOpenIcon strokeWidth={2.5} className="w-6 h-6" />,
    inactiveIcon: <PackageOpenIcon strokeWidth={1.5} className="w-6 h-6" />,
  },
];

// ✅ Admin routes
const ADMIN_NAV_ITEMS: NavItemType[] = [
  {
    path: "/admin/dashboard",
    activeIcon: <LayoutDashboardIcon strokeWidth={2.5} className="w-6 h-6" />,
    inactiveIcon: <LayoutDashboardIcon strokeWidth={1.5} className="w-6 h-6" />,
  },
  {
    path: "/admin/orders",
    activeIcon: <PackageIcon strokeWidth={2.5} className="w-6 h-6" />,
    inactiveIcon: <PackageIcon strokeWidth={1.5} className="w-6 h-6" />,
  },
  {
    path: "/admin/products",
    activeIcon: <ShoppingCartIcon strokeWidth={2.5} className="w-6 h-6" />,
    inactiveIcon: <ShoppingCartIcon strokeWidth={1.5} className="w-6 h-6" />,
  },
  // {
  //   path: "/admin/customers",
  //   activeIcon: <UsersIcon strokeWidth={2.5} className="w-6 h-6" />,
  //   inactiveIcon: <UsersIcon strokeWidth={1.5} className="w-6 h-6" />,
  // },
  {
    path: "/admin/analytics",
    activeIcon: <BarChart3Icon strokeWidth={2.5} className="w-6 h-6" />,
    inactiveIcon: <BarChart3Icon strokeWidth={1.5} className="w-6 h-6" />,
  },
  {
    path: "/admin/coupon",
    activeIcon: <TagsIcon strokeWidth={2.5} className="w-6 h-6" />,
    inactiveIcon: <TagsIcon strokeWidth={1.5} className="w-6 h-6" />,
  },
];

const Sidebar = ({ user, loading }: PropsType) => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: RootState) => state.cartReducer);
  const { ids: wishlistIds } = useSelector(
    (state: RootState) => state.wishlist
  );
  const { isDemoMode } = useSelector((state: RootState) => state.demo);

  // ✅ Decide which routes to show - show admin routes in demo mode
  const navItems = (user?.role === "admin" || isDemoMode) ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <aside
      className={`fixed left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex transition-all duration-300 ${
        isDemoMode ? "top-12 h-[calc(100vh-3rem)]" : "inset-y-0"
      }`}
    >
      <nav className="flex flex-col items-center gap-0 px-2 sm:py-5 space-y-5">
        {navItems.map(({ path, activeIcon, inactiveIcon, badge }) => {
          let badgeCount: number | undefined;
          if (badge === "cart") badgeCount = cartItems.length;
          else if (badge === "wishlist") badgeCount = wishlistIds.length;

          return (
            <NavItem
              key={path}
              to={path}
              iconActive={activeIcon}
              iconInactive={inactiveIcon}
              badgeCount={badgeCount}
            />
          );
        })}
      </nav>

      {/* Bottom Section */}
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <ModeToggle />

        <div className="h-10 w-10">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full rounded-full bg-gray-700 animate-pulse"
            />
          ) : !user?._id ? (
            <button
              onClick={() => navigate("/login")}
              className="h-full w-full flex items-center justify-center"
            >
              <IoIosFingerPrint className="h-full w-full cursor-pointer text-gray-400 hover:text-gray-300 transition-all" />
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full w-full relative flex items-center justify-center"
            >
              <UserAvatar
                moreInfo
                email={user.email}
                name={user.name}
                photo={user.photo}
              />
              {user.role === "admin" ? (
                <ShieldCheckIcon className="-top-2 -right-1 z-10 fill-green-500 absolute" />
              ) : null}
            </motion.div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import NavItem from "./NavItem";
import {
  HomeIcon,
  SearchIcon,
  ShoppingBagIcon,
  PackageOpenIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
  BarChart3Icon,
  TagsIcon,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { ModeToggle } from "../ModeToggle";

export interface NavItemConfig {
  to: string;
  iconActive: JSX.Element;
  iconInactive: JSX.Element;
  showBadge?: boolean;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    to: "/",
    iconActive: <HomeIcon strokeWidth={2.5} className="w-7 h-7" />,
    iconInactive: <HomeIcon strokeWidth={1.5} className="w-7 h-7" />,
  },
  {
    to: "/search",
    iconActive: <SearchIcon strokeWidth={2.5} className="w-7 h-7" />,
    iconInactive: <SearchIcon strokeWidth={1.5} className="w-7 h-7" />,
  },
  {
    to: "/cart",
    iconActive: <ShoppingBagIcon strokeWidth={2.5} className="w-7 h-7" />,
    iconInactive: <ShoppingBagIcon strokeWidth={1.5} className="w-7 h-7" />,
    showBadge: true,
  },
  {
    to: "/wishlist",
    iconActive: <BookmarkCheck strokeWidth={2.5} className="w-7 h-7" />,
    iconInactive: <Bookmark strokeWidth={1.5} className="w-7 h-7" />,
    showBadge: true,
  },
  {
    to: "/orders",
    iconActive: <PackageOpenIcon strokeWidth={2.5} className="w-7 h-7" />,
    iconInactive: <PackageOpenIcon strokeWidth={1.5} className="w-7 h-7" />,
  },
  {
    to: "/admin/dashboard",
    iconActive: <LayoutDashboardIcon strokeWidth={2.5} className="w-7 h-7" />,
    iconInactive: <LayoutDashboardIcon strokeWidth={1.5} className="w-7 h-7" />,
    adminOnly: true,
  },
  {
    to: "/admin/orders",
    iconActive: <PackageIcon strokeWidth={2.5} className="w-7 h-7" />,
    iconInactive: <PackageIcon strokeWidth={1.5} className="w-7 h-7" />,
    adminOnly: true,
  },
  {
    to: "/admin/products",
    iconActive: <ShoppingCartIcon strokeWidth={2.5} className="w-7 h-7" />,
    iconInactive: <ShoppingCartIcon strokeWidth={1.5} className="w-7 h-7" />,
    adminOnly: true,
  },
  {
    to: "/admin/customers",
    iconActive: <UsersIcon strokeWidth={2.5} className="w-7 h-7" />,
    iconInactive: <UsersIcon strokeWidth={1.5} className="w-7 h-7" />,
    adminOnly: true,
  },
  {
    to: "/admin/analytics",
    iconActive: <BarChart3Icon strokeWidth={2.5} className="w-7 h-7" />,
    iconInactive: <BarChart3Icon strokeWidth={1.5} className="w-7 h-7" />,
    adminOnly: true,
  },
  {
    to: "/admin/coupon",
    iconActive: <TagsIcon strokeWidth={2.5} className="w-7 h-7" />,
    iconInactive: <TagsIcon strokeWidth={1.5} className="w-7 h-7" />,
    adminOnly: true,
  },
];

const BottomNavbar: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [lastTouch, setLastTouch] = useState(0);

  const cartCount = useSelector(
    (state: RootState) => state.cartReducer.cartItems.length
  );
  const wishlistCount = useSelector(
    (state: RootState) => state.wishlist.ids.length
  );
  const userRole = useSelector(
    (state: RootState) => state.userReducer.user?.role
  );

  const navItems = useMemo(
    () => NAV_ITEMS.filter((item) => !item.adminOnly || userRole === "admin"),
    [userRole]
  );

  // Scroll hide/show logic (debounced)
  const onScroll = useCallback(
    debounce(() => {
      const y = window.scrollY;
      setVisible(y < lastY || y < 80); // don’t hide immediately at top
      setLastY(y);
    }, 100),
    [lastY]
  );

  // Touch events for mobile
  const onTouchStart = useCallback(
    (e: TouchEvent) => setLastTouch(e.touches[0].clientY),
    []
  );
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      setVisible(y > lastTouch);
      setLastTouch(y);
    },
    [lastTouch]
  );

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    document.body.addEventListener("touchstart", onTouchStart);
    document.body.addEventListener("touchmove", onTouchMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.removeEventListener("touchstart", onTouchStart);
      document.body.removeEventListener("touchmove", onTouchMove);
    };
  }, [onScroll, onTouchStart, onTouchMove]);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full z-50 sm:hidden backdrop-blur-md border-t border-gray-200/20 dark:border-gray-700/30 
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] 
        ${visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}
      `}
    >
      <nav className="flex justify-around items-center py-3 bg-white/70 dark:bg-black/70 backdrop-blur-lg">
        {navItems.map(({ to, iconActive, iconInactive }) => {
          let badgeCount: number | undefined;
          if (to === "/cart") badgeCount = cartCount;
          else if (to === "/wishlist") badgeCount = wishlistCount;

          return (
            <NavItem
              key={to}
              to={to}
              iconActive={iconActive}
              iconInactive={iconInactive}
              badgeCount={badgeCount}
            />
          );
        })}
        <ModeToggle />
      </nav>
    </div>
  );
};

export default React.memo(BottomNavbar);

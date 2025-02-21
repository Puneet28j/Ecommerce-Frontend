import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
  to: string;
  iconActive: React.ReactNode;
  iconInactive: React.ReactNode;
  badgeCount?: number;
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  iconActive,
  iconInactive,
  badgeCount,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <div className="flex flex-col justify-center items-center relative">
      <Link to={to}>
        {isActive ? iconActive : iconInactive}
        {badgeCount! > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs">
            {badgeCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default NavItem;

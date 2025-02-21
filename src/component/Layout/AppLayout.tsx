import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { User } from "../../types/types";
import BottomNavbar from "./BottomNavbar";

interface PropsType {
  user: User | null;
}
export const AppLayout = ({ user }: PropsType) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Sidebar user={user} />
        <Header user={user} />
        <main>
          <Outlet />
        </main>
      </div>
      <div className="block sm:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
};

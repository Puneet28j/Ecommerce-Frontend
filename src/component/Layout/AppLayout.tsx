import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { User } from "../../types/types";
import BottomNavbar from "./BottomNavbar";
import { Suspense } from "react";
import { OfflineWarning } from "@/components/ui/offline-warning";

interface PropsType {
  user: User | null;
  loading: boolean;
}

export const AppLayout = ({ user, loading }: PropsType) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Sidebar user={user} loading={loading} />
        <Header user={user} loading={loading} />
        <main>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <div className="block sm:hidden">
        <BottomNavbar />
      </div>
      <OfflineWarning />
    </div>
  );
};

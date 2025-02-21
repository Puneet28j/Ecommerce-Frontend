import { useNavigate } from "react-router-dom";
import { IoIosFingerPrint } from "react-icons/io";
import { User } from "../../types/types";
import BreadCrumb from "../BreadCrumb";
import { ModeToggle } from "../ModeToggle";
import UserAvatar from "./UseAvatar";

interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
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
        {!user?._id ? (
          <button onClick={() => navigate("/login")}>
            <IoIosFingerPrint className="h-10 w-10" />
          </button>
        ) : (
          <UserAvatar user={user} />
        )}
      </div>
    </header>
  );
};

export default Header;

import { UserIcon } from "lucide-react";
import { useState } from "react";

// User Avatar component
interface UserAvatarProps {
  photo?: string;
  name: string;
}

const UserAvatar = ({ user }: { user: UserAvatarProps }) => {
  const [imageError, setImageError] = useState(false);

  if (user.photo && !imageError) {
    return (
      <img
        src={user.photo}
        alt={user.name}
        loading="lazy"
        className="w-12 h-12 rounded-full object-cover"
        onError={() => setImageError(true)} // Fallback to icon if image fails
      />
    );
  }

  return (
    <UserIcon className="w-12 h-12 p-2 bg-gray-800 rounded-full text-gray-400" />
  );
};

export default UserAvatar;

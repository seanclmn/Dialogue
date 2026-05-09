import { Avatar } from "@components/shared/users/Avatar";
import { Link } from "react-router";

interface UserSearchItemProps {
  id: string;
  username: string;
  avatarUrl?: string | null;
}

export const UserSearchItem = ({ id, username, avatarUrl }: UserSearchItemProps) => {
  return (
    <Link to={`/u/${username}`}>
      <div className="flex flex-row py-2" key={id}>
        <Avatar containerStyle="w-12 h-12 mx-2" src={avatarUrl} />
        <div>
          <p className="text-sm my-0">{username}</p>
          <p className="text-sm my-0"> is a user</p>
        </div>
      </div>
    </Link>
  );
};

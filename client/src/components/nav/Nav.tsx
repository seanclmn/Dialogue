import { Avatar } from "@components/shared/users/Avatar";
import {
  BellAlertIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  MagnifyingGlassCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  MagnifyingGlassCircleIcon as MagnifyingGlassCircleIconSolid,
  BellAlertIcon as BellAlertIconSolid,
} from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router";
import img from "../../assets/jennie.jpeg";
import { useContext } from "react";
import { UserContext } from "@contexts/UserContext";

export const Nav = () => {
  const { pathname } = useLocation();
  const data = useContext(UserContext);
  return (
    <div className="border-brd-color border-r-[1px] px-4 h-full flex-col items-center">
      <Link to="/chats">
        {pathname.includes("/chats") || pathname === "/" ? (
          <ChatBubbleOvalLeftEllipsisIconSolid className="my-4 w-7 font-bold" />
        ) : (
          <ChatBubbleOvalLeftEllipsisIcon className="my-4 w-7" />
        )}
      </Link>
      <Link to="/search">
        {pathname.includes("/search") ? (
          <MagnifyingGlassCircleIconSolid className="my-4 w-7" />
        ) : (
          <MagnifyingGlassCircleIcon className="my-4 w-7" />
        )}
      </Link>
      <Link to="/notifications">
        {pathname.includes("/notifications") ? (
          <BellAlertIconSolid className="my-4 w-7" />
        ) : (
          <BellAlertIcon className="my-4 w-7" />
        )}
      </Link>
      <Link to={`/u/${data.user.username}`}>
        {pathname.includes(`/u/${data.user.username}`) ? (
          <Avatar
            src={img}
            containerStyle="m-0 my-4 w-7 border-bgd-highlight border-[1px]"
          />
        ) : (
          <Avatar src={img} containerStyle="m-0 my-4 w-7" />
        )}
      </Link>
    </div>
  );
};

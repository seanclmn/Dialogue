import { Avatar } from "@components/shared/users/Avatar"
import { ChatBubbleOvalLeftEllipsisIcon, MagnifyingGlassCircleIcon, MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import {
  ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  MagnifyingGlassCircleIcon as MagnifyingGlassCircleIconSolid
} from "@heroicons/react/24/solid"
import { Link, useLocation } from "react-router-dom"
import img from "../../assets/jennie.jpeg";


export const Nav = () => {
  const { pathname } = useLocation()
  return (
    <div className="border-brd-color border-r-[1px] px-4 h-full flex-col items-center">
      <Link to="/friends">
        {pathname.includes("/friends") ? <UserCircleIconSolid className="my-4 w-7 font-bold" /> : <UserCircleIcon className="my-4 w-7" />}
      </Link>
      <Link to="/chats">
        {pathname.includes("/chats") || pathname === "/" ? <ChatBubbleOvalLeftEllipsisIconSolid className="my-4 w-7 font-bold" /> : <ChatBubbleOvalLeftEllipsisIcon className="my-4 w-7" />}
      </Link>
      <Link to="/search">
        {pathname.includes("/search") ? <MagnifyingGlassCircleIconSolid className="my-4 w-7" /> : <MagnifyingGlassCircleIcon className="my-4 w-7" />}
      </Link>
      <Link to="/editprofile">
        {pathname.includes("/editprofile") ? <Avatar src={img} containerStyle="m-0 my-4 w-7 border-bgd-highlight border-[1px]" />
          : <Avatar src={img} containerStyle="m-0 my-4 w-7" />}
      </Link>
    </div>
  )
}
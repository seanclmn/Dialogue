import { ChatBubbleOvalLeftEllipsisIcon, MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"

export const Nav = () => {
  return (
    <div className="border-brd-color border-r-[1px] px-4 h-full flex-col items-center">
      <Link to="/chats">
        <ChatBubbleOvalLeftEllipsisIcon className="my-4 w-7" />
      </Link>
      <Link to="/search">
        <MagnifyingGlassIcon className="my-4 w-7" />
      </Link>
      <Link to="/editprofile">
        <UserCircleIcon className="my-4 w-7" />
      </Link>
    </div>
  )
}
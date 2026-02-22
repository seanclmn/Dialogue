import { Avatar } from "@components/shared/users/Avatar";
import {
  BellAlertIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  MagnifyingGlassCircleIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisIconSolid,
  BellAlertIcon as BellAlertIconSolid,
  MagnifyingGlassCircleIcon as MagnifyingGlassCircleIconSolid,
} from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router";
import img from "../../assets/jennie.jpeg";
import { useContext } from "react";
import { UserContext } from "@contexts/UserContext";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useCookies } from "react-cookie";

export const Nav = () => {
  const { pathname } = useLocation();
  const data = useContext(UserContext);
  const [cookies, setCookies, removeCookie] = useCookies([
    "accessToken",
    "theme",
  ]);

  const handleLogout = () => {
    removeCookie("accessToken", { path: "/" });
  };

  const toggleTheme = () => {
    const newTheme = cookies["theme"] === "dark" ? "light" : "dark";
    setCookies("theme", newTheme, { path: "/" });
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="border-brd-color border-r-[1px] px-4 h-full flex flex-col items-center justify-between py-4">
      <div className="flex flex-col items-center">
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

      <div className="mt-auto">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors">
            <Bars3Icon className="w-7 text-gray-600" />
          </MenuButton>

          <MenuItems
            transition
            className="absolute bottom-full left-0 mb-2 w-48 origin-bottom-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <MenuItem>
              <button
                onClick={toggleTheme}
                className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
              >
                {cookies["theme"] === "dark" ? (
                  <>
                    <SunIcon className="mr-2 h-5 w-5" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <MoonIcon className="mr-2 h-5 w-5" />
                    Dark Mode
                  </>
                )}
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
              >
                Logout
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

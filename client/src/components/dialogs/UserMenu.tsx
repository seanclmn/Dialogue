import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { KeyIcon } from "@heroicons/react/16/solid";
import { PencilIcon } from "@heroicons/react/16/solid";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useCookies } from "react-cookie";
import { Link } from "react-router";

export default function UserMenu() {
  const [, removeCookie] = useCookies(["accessToken"]);

  return (
    <div className="text-right">
      <Menu>
        <MenuButton
          className="
          inline-flex items-center gap-2 
          rounded-md py-1.5 
          px-3 font-semibold 
          data-[focus]:outline-1 
          data-[focus]:outline-black"
        >
          <UserCircleIcon className="size-6" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="
          w-52 origin-top-right 
          rounded-xl border border-brd-color
          bg-bgd-color p-1 text-sm/6
          transition duration-100 ease-out 
          [--anchor-gap:var(--spacing-1)] 
          focus:outline-none 
          data-[closed]:scale-95"
        >
          <MenuItem>
            <Link
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-bgd-highlight"
              to="/editprofile"
            >
              <PencilIcon className="size-4" />
              Edit
            </Link>
          </MenuItem>
          <MenuItem>
            <button
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-bgd-highlight"
              onClick={(e) => {
                e.preventDefault();
                removeCookie("accessToken", null);
              }}
            >
              <KeyIcon className="size-4" />
              Log out
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { KeyIcon } from '@heroicons/react/16/solid'
import { TvIcon } from '@heroicons/react/16/solid'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { CogIcon } from '@heroicons/react/20/solid'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { useCookies } from 'react-cookie'

export default function UserMenu() {
  const [, removeCookie] = useCookies(['accessToken'])

  return (
    <div className=" text-right">
      <Menu>
        <MenuButton className="
          inline-flex items-center gap-2 
          rounded-md py-1.5 
          px-3 font-semibold 
          data-[focus]:outline-1 
          data-[focus]:outline-black">
          <UserCircleIcon className="size-6" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="
          w-52 origin-top-right 
          rounded-xl border border-white/5 
          bg-gray-100 p-1 text-sm/6
          transition duration-100 ease-out 
          [--anchor-gap:var(--spacing-1)] 
          focus:outline-none 
          data-[closed]:scale-95 "
        >
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
              <PencilIcon className="size-4" />
              Edit
            </button>
          </MenuItem>
          <MenuItem>
            <button
              className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
              onClick={(e) => {
                e.preventDefault()
                removeCookie("accessToken", null)
              }}>
              <KeyIcon className="size-4" />
              Log out
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  )
}

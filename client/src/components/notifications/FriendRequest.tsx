import { useAcceptFriendRequest } from "@mutations/AcceptFriendRequest";
import { useDeclineFriendRequest } from "@mutations/DeclineFriendRequest";
import { Avatar } from "@components/shared/users/Avatar";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react/jsx-runtime";
type FriendRequestProps = {
  data: {
    accepted: boolean;
    declined: boolean;
    friendRequestId: string;
    notificationId: string;
    sender: {
      id: string;
      username: string;
      avatarUrl?: string | null;
    };
  };
};

export const FriendRequest = ({ data }: FriendRequestProps) => {
  return (
      <div className="p-2 flex flex-row items-center">

        <div className="flex flex-row items-center gap-2 mr-32">
          <Avatar containerStyle="w-12 h-12 shrink-0" src={data.sender.avatarUrl} />
          <div className="flex flex-col">

          <p className="text-sm font-medium">{data.sender.username}</p>
          <p className="text-xs text-gray-500">{data.sender.username} sent you a friend request</p>
          </div>
        </div>
        {!data.accepted ? (
          <FriendRequestOptions friendRequestId={data.friendRequestId} notificationId={data.notificationId} />
        ) : (
          <p className="text-sm">{data.sender.username} is now your friend!</p>
        )}
      </div>
  );
};


const FriendRequestOptions = ({ friendRequestId, notificationId }: { friendRequestId: string, notificationId: string | undefined }) => {
  const { acceptFriendRequest, isMutationInFlight: isAccepting } = useAcceptFriendRequest(friendRequestId, notificationId);
  const { declineFriendRequest, isMutationInFlight: isDeclining } = useDeclineFriendRequest(friendRequestId, notificationId);

  return (
    <Menu as="div" className="relative inline-block text-left my-2 mx-2">
            <div>
              <MenuButton 
                disabled={isAccepting || isDeclining}
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isAccepting ? "Accepting..." : isDeclining ? "Declining..." : "Accept Request"}
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-white" aria-hidden="true" />
              </MenuButton>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => acceptFriendRequest()}
                        disabled={isAccepting || isDeclining}
                        className={`${
                          focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } block w-full px-4 py-2 text-left text-sm disabled:opacity-50`}
                      >
                        Accept
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => declineFriendRequest()}
                        disabled={isAccepting || isDeclining}
                        className={`${
                          focus ? 'bg-gray-100 text-red-600' : 'text-red-500'
                        } block w-full px-4 py-2 text-left text-sm disabled:opacity-50`}
                      >
                        Decline
                      </button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
    );
};
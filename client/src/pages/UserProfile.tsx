import { Avatar } from "@components/shared/users/Avatar";
import img from "../assets/jennie.jpeg";
import { useParams } from "react-router";
import { useContext, useEffect } from "react";
import {
  PreloadedQuery,
  useMutation,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { graphql } from "relay-runtime";
import { UserProfileQuery } from "@generated/UserProfileQuery.graphql";
import { Loader } from "@components/shared/loaders/Loader";
import { Button } from "@components/shared/Buttons/GenericButton";
import { UserProfileMutation } from "@generated/UserProfileMutation.graphql";
import { UserContext } from "../contexts/UserContext";
import { useAcceptFriendRequest } from "@mutations/AcceptFriendRequest";
import { useDeclineFriendRequest } from "@mutations/DeclineFriendRequest";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

const query = graphql`
  query UserProfileQuery($username: String!) {
    user(username: $username) {
      username
      id
      bio
      isFriend
      friendRequests {
        id
        sender {
          id
        }
        receiver {
          id
        }
        accepted
        declined
      }
    }
  }
`;

const mutation = graphql`
  mutation UserProfileMutation($receiverId: String!, $senderId: String!) {
    sendFriendRequest(
      sendFriendRequestInput: { receiverId: $receiverId, senderId: $senderId }
    ) {
      id
      accepted
      declined
    }
  }
`;

type ContentProps = {
  queryReference: PreloadedQuery<UserProfileQuery>;
};

const Content = ({ queryReference }: ContentProps) => {
  const data = usePreloadedQuery<UserProfileQuery>(query, queryReference);
  const currentUser = useContext(UserContext);
  const [commitMutation, isMutationInFlight] =
    useMutation<UserProfileMutation>(mutation);

  const hasSentRequest = data.user.friendRequests?.some(
    (req) => req.sender.id === currentUser.user.id && !req.accepted && !req.declined
  );

  const hasReceivedRequest = data.user.friendRequests?.find(
    (req) => req.receiver.id === currentUser.user.id && !req.accepted && !req.declined
  );

  const { acceptFriendRequest, isMutationInFlight: isAccepting } = useAcceptFriendRequest(hasReceivedRequest?.id || "");
  const { declineFriendRequest, isMutationInFlight: isDeclining } = useDeclineFriendRequest(hasReceivedRequest?.id || "");

  const isFriend = data.user.isFriend;
  console.log(isFriend)

  return (
    <div className="w-full flex flex-col items-center py-2 max-w-96 mx-auto bg-bgd-color text-txt-color min-h-full">
      {data.user.username === currentUser.user.username ? (
        <Avatar
          src={img}
          containerStyle="w-28 h-28 my-2"
          editable
          link="/editprofile"
        />
      ) : (
        <Avatar src={img} containerStyle="w-28 h-28 my-2" />
      )}
      <p className="my-2">{data.user.username}</p>
      <p className="text-sm text-gray-500">{data.user.bio}</p>
      {data.user.id !== currentUser.user.id ? (
        hasReceivedRequest ? (
          <Menu as="div" className="relative inline-block text-left my-2">
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
        ) : (
          <Button
            title={
              isFriend
                ? "Friends"
                : hasSentRequest
                  ? "Requested"
                  : "Add Friend"
            }
            styles={
              `my-2 ${hasSentRequest || isFriend
                ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                : ""}`
            }
            disabled={isMutationInFlight || hasSentRequest || isFriend}
            onClick={() => {
              if (currentUser.user.id && !hasSentRequest && !isFriend) {
                commitMutation({
                  variables: {
                    receiverId: data.user.id,
                    senderId: currentUser.user.id,
                  },
                }).dispose();
              }
            }}
          />
        )
      ) : null}
    </div>
  );
};

export const UserProfile = () => {
  const { username } = useParams();
  const [queryReference, loadQuery] = useQueryLoader<UserProfileQuery>(query);

  useEffect(() => {
    if (username) {
      loadQuery({ username: username });
    }
  }, [username]);

  if (!queryReference) return <Loader />;

  return <Content queryReference={queryReference} />;
};

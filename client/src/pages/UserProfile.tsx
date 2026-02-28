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

const query = graphql`
  query UserProfileQuery($username: String!) {
    user(username: $username) {
      username
      id
      bio
      friendRequests {
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

  const hasReceivedRequest = data.user.friendRequests?.some(
    (req) => req.receiver.id === currentUser.user.id && !req.accepted && !req.declined
  );

  const isFriend = data.user.friendRequests?.some(
    (req) => (req.sender.id === currentUser.user.id || req.receiver.id === currentUser.user.id) && req.accepted
  );

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
        <Button
          title={
            isFriend
              ? "Friends"
              : hasSentRequest
                ? "Requested"
                : hasReceivedRequest
                  ? "Accept Request"
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

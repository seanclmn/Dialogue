import { useContext } from "react";
import { graphql, useMutation } from "react-relay";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
import { AcceptFriendRequestMutation } from "@generated/AcceptFriendRequestMutation.graphql";

const acceptRequestMutation = graphql`
  mutation AcceptFriendRequestMutation(
    $acceptFriendRequestInput: AcceptFriendRequestInput!
  ) {
    acceptFriendRequest(acceptFriendRequestInput: $acceptFriendRequestInput) {
      id
      accepted
      declined
    }
  }
`;

export const useAcceptFriendRequest = (friendRequestId: string) => {
  const userContext = useContext(UserContext);
  const [commitMutation, isMutationInFlight] =
    useMutation<AcceptFriendRequestMutation>(acceptRequestMutation);

  const acceptFriendRequest = () => {
    if (userContext.user.id)
      commitMutation({
        variables: {
          acceptFriendRequestInput: {
            friendRequestId: friendRequestId,
          },
        },
        onCompleted: () => {
          toast.success("Friend request accepted!");
        },
        onError: (e: any) => {
          const message = e.source?.errors?.[0]?.message || e.message || "Failed to accept friend request";
          toast.error(message);
        },
      }).dispose();
  };

  return { acceptFriendRequest, isMutationInFlight };
};

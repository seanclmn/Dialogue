import { useContext } from "react";
import { graphql, useMutation } from "react-relay";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
import { DeclineFriendRequestMutation } from "@generated/DeclineFriendRequestMutation.graphql";

const declineRequestMutation = graphql`
  mutation DeclineFriendRequestMutation(
    $declineFriendRequestInput: DeclineFriendRequestInput!
  ) {
    declineFriendRequest(
      declineFriendRequestInput: $declineFriendRequestInput
    ) {
      id
      accepted
      declined
    }
  }
`;

export const useDeclineFriendRequest = (friendRequestId: string) => {
  const userContext = useContext(UserContext);
  const [commitMutation, isMutationInFlight] =
    useMutation<DeclineFriendRequestMutation>(declineRequestMutation);

  const declineFriendRequest = () => {
    if (userContext.user.id)
      commitMutation({
        variables: {
          declineFriendRequestInput: {
            friendRequestId: friendRequestId,
          },
        },
        onCompleted: () => {
          toast.success("Friend request declined");
        },
        onError: (e: any) => {
          const message = e.source?.errors?.[0]?.message || e.message || "Failed to decline friend request";
          toast.error(message);
        },
      });
  };

  return { declineFriendRequest, isMutationInFlight };
};

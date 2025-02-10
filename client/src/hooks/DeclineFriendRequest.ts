import { useContext } from "react";
import { graphql, useMutation } from "react-relay";
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
      });
  };

  return { declineFriendRequest, isMutationInFlight };
};

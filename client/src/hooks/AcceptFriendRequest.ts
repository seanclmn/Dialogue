import { useContext } from "react";
import { graphql, useMutation } from "react-relay";
import { UserContext } from "../contexts/UserContext";
import { AcceptFriendRequestMutation } from "@generated/AcceptFriendRequestMutation.graphql";

const acceptRequestMutation = graphql`
  mutation AcceptFriendRequestMutation(
    $acceptFriendRequestInput: AcceptFriendRequestInput!
  ) {
    acceptFriendRequest(acceptFriendRequestInput: $acceptFriendRequestInput) {
      id
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
      }).dispose();
  };

  return { acceptFriendRequest, isMutationInFlight };
};

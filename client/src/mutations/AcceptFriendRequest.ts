import { useContext } from "react";
import { ConnectionHandler, graphql, useMutation } from "react-relay";
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

export const useAcceptFriendRequest = (friendRequestId: string, notificationId?: string) => {
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
        updater: (store) => {
          if (notificationId && userContext.user.id) {
            const userRecord = store.get(userContext.user.id);
            if (userRecord) {
              const connection = ConnectionHandler.getConnection(
                userRecord,
                "NotificationsList_notifications"
              );
              if (connection) {
                ConnectionHandler.deleteNode(connection, notificationId);
              }
            }
          }
        },
        onCompleted: () => {
          toast.success("Friend request accepted!");
        },
        onError: (e: any) => {
          const message = e.source?.errors?.[0]?.message || e.message || "Failed to accept friend request";
          toast.error(message);
        },
      });
  };

  return { acceptFriendRequest, isMutationInFlight };
};

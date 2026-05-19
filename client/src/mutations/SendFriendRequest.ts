import { useContext } from "react";
import { graphql } from "relay-runtime";
import { useMutation } from "react-relay";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
import { SendFriendRequestMutation } from "@generated/SendFriendRequestMutation.graphql";

const sendRequestMutation = graphql`
  mutation SendFriendRequestMutation($receiverId: String!, $senderId: String!) {
    sendFriendRequest(
      sendFriendRequestInput: { receiverId: $receiverId, senderId: $senderId }
    ) {
      id
      accepted
      declined
      sender {
        id
      }
      receiver {
        id
      }
    }
  }
`;

export const useSendFriendRequest = (profileUserId: string) => {
  const { user } = useContext(UserContext);
  const [commitMutation, isMutationInFlight] =
    useMutation<SendFriendRequestMutation>(sendRequestMutation);

  const sendFriendRequest = () => {
    if (!user.id) return;
    commitMutation({
      variables: {
        receiverId: profileUserId,
        senderId: user.id,
      },
      updater: (store) => {
        const newRequest = store.getRootField("sendFriendRequest");
        if (!newRequest) return;

        const senderRecord = store.get(user.id!);
        if (senderRecord) newRequest.setLinkedRecord(senderRecord, "sender");

        const profileUserRecord = store.get(profileUserId);
        if (!profileUserRecord) return;
        const existing = profileUserRecord.getLinkedRecords("friendRequests") ?? [];
        profileUserRecord.setLinkedRecords([...existing, newRequest], "friendRequests");
      },
      onCompleted: () => {
        toast.success("Friend request sent!");
      },
      onError: (e: any) => {
        const message =
          e.source?.errors?.[0]?.message || e.message || "Failed to send friend request";
        toast.error(message);
      },
    });
  };

  return { sendFriendRequest, isMutationInFlight };
};

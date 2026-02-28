import { TextButton } from "@components/shared/Buttons/TextButton";
import { useAcceptFriendRequest } from "@mutations/AcceptFriendRequest";
import { useDeclineFriendRequest } from "@mutations/DeclineFriendRequest";

type FriendRequestProps = {
  data: {
    accepted: boolean;
    declined: boolean;
    friendRequestId: string;
    notificationId: string;
    sender: {
      id: string;
      username: string;
    };
  };
};

export const FriendRequest = ({ data }: FriendRequestProps) => {
  console.log("FriendRequest.tsx", data.notificationId, data.friendRequestId);
  const { acceptFriendRequest } = useAcceptFriendRequest(data.friendRequestId, data.notificationId);
  const { declineFriendRequest } = useDeclineFriendRequest(data.friendRequestId, data.notificationId);

  return (
    <div>
      <div className="p-2">
        {!data.accepted ? (
          <p className="text-sm">
            {data.sender.username} requested to be your friend!
          </p>
        ) : (
          <p className="text-sm">{data.sender.username} is now your friend!</p>
        )}
      </div>

      {!data.accepted ? (
        <div className="flex flex-row">
          <TextButton
            text="Approve"
            className="mx-2"
            onClick={() => acceptFriendRequest()}
          />
          <TextButton
            text="Decline"
            className="mx-2"
            onClick={() => declineFriendRequest()}
          />
        </div>
      ) : null}
    </div>
  );
};

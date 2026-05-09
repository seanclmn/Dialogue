import { Button } from "@components/shared/Buttons/Button";
import { useAcceptFriendRequest } from "@mutations/AcceptFriendRequest";
import { useDeclineFriendRequest } from "@mutations/DeclineFriendRequest";
import { Avatar } from "@components/shared/users/Avatar";

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
  const { acceptFriendRequest } = useAcceptFriendRequest(data.friendRequestId, data.notificationId);
  const { declineFriendRequest } = useDeclineFriendRequest(data.friendRequestId, data.notificationId);

  return (
    <div>
      <div className="p-2 flex flex-row items-center gap-2">
        <Avatar containerStyle="w-10 h-10 shrink-0" src={data.sender.avatarUrl} />
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
          <Button
            onClick={() => acceptFriendRequest()}
          > Approve </Button>
          <Button
            onClick={() => declineFriendRequest()}
          > Decline </Button>
        </div>
      ) : null}
    </div>
  );
};

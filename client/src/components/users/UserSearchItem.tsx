import { Avatar } from "@components/shared/users/Avatar"
import img from "../../assets/jennie.jpeg"


interface UserSearchItemProps {
  id: string
  username: string;
}

export const UserSearchItem = ({ id, username }: UserSearchItemProps) => {
  return (
    <div className="flex flex-row py-2" key={id}>
      <Avatar containerStyle="w-12 mx-2" src={img} />
      <div>
        <p className="text-sm my-0">{username}</p>
        <p className="text-sm my-0"> is a user</p>
      </div>
    </div>
  )
}
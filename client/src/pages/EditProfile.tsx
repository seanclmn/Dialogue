import { Input } from "@components/shared/Inputs/GenericInput"
import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Avatar } from "@components/shared/users/Avatar"
import img from "../assets/jennie.jpeg"

export const EditProfile = () => {

  const data = useContext(UserContext)
  const [username, setUsername] = useState(data.user.username)

  return (
    <div className="w-full flex flex-col items-center py-2">
      <Avatar src={img} containerStyle="w-28 my-2" />
      <p className="my-2">{data.user.username}</p>
      <Input
        title={"username"}
        defaultValue={username ?? ""}
        onChange={(e) => setUsername(e.currentTarget.value)}
      />
    </div>
  )
}
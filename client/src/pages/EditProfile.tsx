import { Input } from "@components/shared/Inputs/GenericInput"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../UserContext"

export const EditProfile = () => {

  const data = useContext(UserContext)
  console.log(data.user.username)
  const [username, setUsername] = useState(data.user.username)

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <div>
      <Input
        title={"username"}
        defaultValue={username ?? ""}
        onChange={(e) => setUsername(e.currentTarget.value)}
      />
    </div>
  )
}
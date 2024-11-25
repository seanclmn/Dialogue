import { Input } from "@components/shared/Inputs/GenericInput"
import { useState } from "react"
import { graphql } from "relay-runtime"

// const query = graphql`
//   users {
//     chats
//   }
// `

export const UserSearch = () => {
  const [input, setInput] = useState("")
  return (
    <div>
      <Input title={"search users"} onChange={(e) => setInput(e.currentTarget.value)} />
    </div>
  )
}
import { Input, InputProps } from "@components/shared/Inputs/GenericInput"
import { useState } from "react"
import { useLazyLoadQuery, useRefetchableFragment } from "react-relay"
import { graphql } from "relay-runtime"


const query = graphql`
    query UserSearchQuery($username:String!) {
    users(username: $username) {
      id
    }
  }
`

const fragment = graphql`
  fragment UserSearchFragment on Query @refetchable(queryName: "UserSearchRefetchQuery") {
    users(username: $username) {
      id
    }
  }
`

interface UserSearchComponentProps {
  setInput: (message: string) => void;
  data: 
}

const UserSearchComponent = ({ setInput }: UserSearchComponentProps) => {
  const data = useRefetchableFragment(fragment)
  return (
    <Input
      title={"search users"}
      onChange={(e) => {
        setInput(e.currentTarget.value)
      }} />

  )
}

export const UserSearch = () => {
  const [input, setInput] = useState("")
  const data = useLazyLoadQuery(query, { username: input })
  return (
    <div>
      <UserSearchComponent
        setInput={setInput}
      />
    </div>
  )
}
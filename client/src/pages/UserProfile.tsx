
import { Avatar } from "@components/shared/users/Avatar"
import img from "../assets/jennie.jpeg"
import { useParams } from "react-router"
import { useContext, useEffect } from "react"
import { graphql } from "relay-runtime"
import { PreloadedQuery, useMutation, usePreloadedQuery, useQueryLoader } from "react-relay"
import { UserProfileQuery } from "@generated/UserProfileQuery.graphql"
import { Loader } from "@components/shared/loaders/Loader"
import { Button } from "@components/shared/Buttons/GenericButton"
import { UserProfileMutation } from "@generated/UserProfileMutation.graphql"
import { UserContext } from "../UserContext"

const query = graphql`
  query UserProfileQuery($username: String!) {
    user(username: $username) {
      username
      id
    }
  }
`

const mutation = graphql`
  mutation UserProfileMutation($receiverId: String!, $senderId: String!) {
    sendFriendRequest(friendRequestInput: {receiverId: $receiverId, senderId: $senderId}){  
      username
      id
    }
  }
`

type ContentProps = {
  queryReference: PreloadedQuery<UserProfileQuery>

}

const Content = ({ queryReference }: ContentProps) => {
  const data = usePreloadedQuery(query, queryReference)
  const currentUser = useContext(UserContext)
  const [commitMutation, isMutationInFlight] = useMutation<UserProfileMutation>(mutation)

  return (
    <div className="w-full flex flex-col items-center py-2">
      <Avatar src={img} containerStyle="w-28 my-2" />
      <p className="my-2">{data.user.username}</p>
      <Button title="Add" onClick={() => {
        if (currentUser.user.id) {
          commitMutation({
            variables: {
              receiverId: data.user.id,
              senderId: currentUser.user.id
            }
          }).dispose()
        }
      }} />
    </div>
  )
}

export const UserProfile = () => {
  const { username } = useParams()
  const [queryReference, loadQuery] = useQueryLoader<UserProfileQuery>(query)

  useEffect(() => {
    if (username) {
      loadQuery({ username: username })

    }
  }, [])

  if (!queryReference) return <Loader />

  return (
    <Content queryReference={queryReference} />
  )
}
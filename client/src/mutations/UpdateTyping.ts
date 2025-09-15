import { UpdateTypingMutation, UpdateTypingMutation$data } from "@generated/UpdateTypingMutation.graphql"
import { graphql, useMutation } from "react-relay"

const updateTypingMutation = graphql`
  mutation UpdateTypingMutation(
    $chatId: String!, $isTyping: Boolean!, $userId: String!
  ) {
    updateTyping(chatId: $chatId, isTyping: $isTyping, userId: $userId) {
        chatId
        userId
      }
  }
`

export const useUpdateTyping = () => {
  const [commitMutation, isMutationInFlight] = useMutation<UpdateTypingMutation>(updateTypingMutation)

  const updateTyping = (input: { chatId: string; isTyping: boolean; userId: string }) => {
    commitMutation({
      variables: {
        chatId: input.chatId,
        isTyping: input.isTyping,
        userId: input.userId
      },

      onCompleted: (data: UpdateTypingMutation$data) => {
        console.log(data)
      }
    })
  }


  return { updateTyping, isMutationInFlight }
}
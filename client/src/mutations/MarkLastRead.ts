import { MarkLastReadMutation } from "@generated/MarkLastReadMutation.graphql";
import { graphql, useMutation } from "react-relay";

const markLastReadMutation = graphql`
  mutation MarkLastReadMutation($chatId: ID!, $messageId: ID!) {
    markLastRead(chatId: $chatId, messageId: $messageId) {
      id
      lastReadMessage {
        id
      }
    }
  }
`;

export const useMarkLastRead = () => {
  const [commitMutation, isMutationInFlight] =
    useMutation<MarkLastReadMutation>(markLastReadMutation);

  const markLastRead = (chatId: string, messageId: string) => {
    commitMutation({ variables: { chatId, messageId } });
  };

  return { markLastRead, isMutationInFlight };
};

import { RemoveMessageReactionMutation } from "@generated/RemoveMessageReactionMutation.graphql";
import { graphql, useMutation } from "react-relay";

const removeMessageReactionMutation = graphql`
  mutation RemoveMessageReactionMutation($messageId: ID!, $emoji: String!) {
    removeMessageReaction(messageId: $messageId, emoji: $emoji) {
      id
      reactions {
        id
        emoji
        createdAt
        user {
          id
          username
          avatarUrl
        }
      }
    }
  }
`;

export const useRemoveMessageReaction = () => {
  const [commitMutation, isMutationInFlight] =
    useMutation<RemoveMessageReactionMutation>(removeMessageReactionMutation);

  const removeMessageReaction = (messageId: string, emoji: string) => {
    commitMutation({ variables: { messageId, emoji } });
  };

  return { removeMessageReaction, isMutationInFlight };
};

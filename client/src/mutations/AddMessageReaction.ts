import { AddMessageReactionMutation } from "@generated/AddMessageReactionMutation.graphql";
import { graphql, useMutation } from "react-relay";

const addMessageReactionMutation = graphql`
  mutation AddMessageReactionMutation($messageId: ID!, $emoji: String!) {
    addMessageReaction(messageId: $messageId, emoji: $emoji) {
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

export const useAddMessageReaction = () => {
  const [commitMutation, isMutationInFlight] =
    useMutation<AddMessageReactionMutation>(addMessageReactionMutation);

  const addMessageReaction = (messageId: string, emoji: string) => {
    commitMutation({ variables: { messageId, emoji } });
  };

  return { addMessageReaction, isMutationInFlight };
};

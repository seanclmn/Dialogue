import { graphql } from "relay-runtime";
import { useMutation } from "react-relay";
import { UpdateUserMutation } from "@generated/UpdateUserMutation.graphql";

const updateUserMutation = graphql`
  mutation UpdateUserMutation(
    $updateUserInput: UpdateUserInput!
  ) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      username
      bio
    }
  }
`

export const useUpdateUserMutation = () => {
  const [commitMutation, isMutationInFlight] = useMutation<UpdateUserMutation>(updateUserMutation);

  const updateUser = (input: { id: string; username: string; bio?: string }) => {
    commitMutation({
      variables: {
        updateUserInput: input,
      },
    });
  };

  return { updateUser, isMutationInFlight };
}
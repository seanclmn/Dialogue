import { graphql } from "relay-runtime";
import { useMutation } from "react-relay";
import toast from "react-hot-toast";
import { UpdateUserMutation, UpdateUserMutation$data } from "@generated/UpdateUserMutation.graphql";
import { useContext } from "react";
import { User, UserContext } from "@contexts/UserContext";

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
  const { user, setUser } = useContext(UserContext);
  const [commitMutation, isMutationInFlight] = useMutation<UpdateUserMutation>(updateUserMutation);

  const updateUser = (input: { id: string; username: string; bio?: string }) => {
    commitMutation({
      variables: {
        updateUserInput: input,

      },
      onCompleted: (data: UpdateUserMutation$data) => {
        const updatedUser: User = {
          ...user,
          username: data.updateUser.username,
          bio: data.updateUser.bio ?? user.bio,
        };
        setUser(updatedUser);
        toast.success("Profile updated!");
      },
      onError: (e: any) => {
        const message = e.source?.errors?.[0]?.message || e.message || "Failed to update profile";
        toast.error(message);
      }
    });

  };

  return { updateUser, isMutationInFlight };
}
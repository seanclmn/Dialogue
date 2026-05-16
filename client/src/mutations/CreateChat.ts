import { useContext } from "react";
import { ConnectionHandler, graphql } from "relay-runtime";
import { useMutation } from "react-relay";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { UserContext } from "@contexts/UserContext";
import { CreateChatMutation } from "@generated/CreateChatMutation.graphql";

const createChatMutation = graphql`
  mutation CreateChatMutation($input: CreateChatInput!) {
    createChat(createChatInput: $input) {
      id
      name
      participants {
        username
      }
      lastMessage {
        text
        userId
        username
      }
    }
  }
`;

export const useCreateChat = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [commitMutation, isInFlight] = useMutation<CreateChatMutation>(createChatMutation);

  const createChat = (
    participants: string[],
    { name = null, onCompleted }: { name?: string | null; onCompleted?: () => void } = {}
  ) => {
    if (!user.id) return;

    commitMutation({
      variables: {
        input: {
          name: name ?? "",
          participants,
        },
      },
      updater: (store) => {
        const userRecord = store.get(user.id!);
        if (!userRecord) return;

        const connection = ConnectionHandler.getConnection(
          userRecord,
          "Chats_chats"
        );
        if (!connection) return;

        const newChat = store.getRootField("createChat");
        if (!newChat) return;

        // Server may return an existing DM — don't insert a duplicate edge
        const chatId = newChat.getDataID();
        const existingEdges = connection.getLinkedRecords("edges");
        const alreadyInConnection = existingEdges?.some(
          (edge) => edge?.getLinkedRecord("node")?.getDataID() === chatId
        );
        if (alreadyInConnection) return;

        const newEdge = ConnectionHandler.createEdge(
          store,
          connection,
          newChat,
          "ChatEdge"
        );
        ConnectionHandler.insertEdgeAfter(connection, newEdge);
      },
      onCompleted: (data) => {
        const chatId = data.createChat?.id;
        onCompleted?.();
        if (chatId) navigate(`/chats/${chatId}`);
      },
      onError: (e: any) => {
        const message =
          e.source?.errors?.[0]?.message || e.message || "Failed to create chat";
        toast.error(message);
      },
    });
  };

  return { createChat, isInFlight };
};

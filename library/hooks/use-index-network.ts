import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createIndexNetworkService } from "@/services/index-network";
import { useStore } from "@/store/useStore";
import {
  AddMessageParams,
  Conversation,
  CreateConversationParams,
} from "@/types";

export const useIndexNetwork = (conversationId?: string) => {
  const did = useStore((store) => store.did);
  const service = did ? createIndexNetworkService(did) : null;
  const queryClient = useQueryClient();

  const createConversation = useMutation<
    Conversation,
    Error,
    CreateConversationParams
  >({
    mutationFn: (params) => {
      if (!service) throw new Error("DID is empty or undefined");
      return service.createConversation(params);
    },
  });

  const addMessage = useMutation<
    Conversation["messages"][0],
    Error,
    { conversationId: string } & AddMessageParams
  >({
    mutationFn: ({ conversationId, ...params }) => {
      if (!service) throw new Error("DID is empty or undefined");
      return service.addMessageToConversation(conversationId, params);
    },
  });

  const conversationQuery = useQuery<Conversation, Error>({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!service) throw new Error("DID is empty or undefined");
      if (!conversationId) throw new Error("Conversation ID is undefined");

      // Try to get the conversation from the cache first
      const cachedData = queryClient.getQueryData<Conversation[]>([
        "conversations",
      ]);
      const cachedConversation = cachedData?.find(
        (conv) => conv.id === conversationId,
      );

      if (cachedConversation) {
        // If found in cache, check if we need more details
        if (cachedConversation.messages) {
          return cachedConversation;
        }
        // If we need more details, fetch them but start with cached data
        const fullConversation = await service.getConversation(conversationId);
        return { ...cachedConversation, ...fullConversation };
      }

      // If not in cache, fetch from the service
      return service.getConversation(conversationId);
    },
    enabled: !!conversationId && !!service,
  });

  const conversationsQuery = useQuery<Conversation[], Error>({
    queryKey: ["conversations"],
    queryFn: () => {
      if (!service) throw new Error("DID is empty or undefined");
      return service.getConversations();
    },
    enabled: !!service,
  });

  return {
    createConversation,
    addMessage,
    conversationQuery,
    conversationsQuery,
  };
};

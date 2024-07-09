import { useMutation, useQuery } from "@tanstack/react-query";
import { createIndexNetworkService } from "@/services/index-network";
import { useStore } from "@/store/useStore";

export const useIndexNetwork = (conversationId?: string) => {
  const did = useStore((store) => store.did);
  const service = createIndexNetworkService(did);

  const createConversation = useMutation({
    mutationFn: (params: Parameters<typeof service.createConversation>[0]) =>
      service.createConversation(params),
  });

  const addMessage = useMutation({
    mutationFn: ({
      conversationId,
      ...params
    }: {
      conversationId: string;
    } & Parameters<typeof service.addMessageToConversation>[1]) =>
      service.addMessageToConversation(conversationId, params),
  });

  const conversationQuery = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => service.getConversation(conversationId!),
    enabled: !!conversationId,
  });

  return {
    createConversation,
    addMessage,
    conversationQuery,
  };
};

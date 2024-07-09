"use client";

import { useState } from "react";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/text-area";
import { useIndexNetwork } from "@/hooks/use-index-network";
import { useStore } from "@/store/useStore";

const TestPage = () => {
  const did = useStore((store) => store.did);
  const [conversationId, setConversationId] = useState(
    "kjzl6kcym7w8y7y9hwftetazxz2roh5olwl4fjn2w5ckawpz7nyiv6laatz3umg",
  );
  const [message, setMessage] = useState("");

  const { createConversation, addMessage, conversationQuery } =
    useIndexNetwork(conversationId);

  const handleCreateConversation = async () => {
    try {
      const result = await createConversation.mutateAsync({
        summary: "New conversation",
        sources: [
          "did:pkh:eip155:1:0x524C889CE68dcaF3830694415EdE91508681D104",
        ],
        members: [
          "did:key:z6MkmvBmZitP8GKFrscX1PgpGA7X5Mw3nX1EWcC2Xrx4FST8",
          "did:key:z6MkmFfvAAMgh2zd6kscS73b6yyJFDNRr8h4EU7AhWnQtcXc",
        ],
      });
      setConversationId(result.id);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleAddMessage = async () => {
    if (!conversationId) {
      console.error("No conversation ID set");
      return;
    }
    try {
      await addMessage.mutateAsync({
        conversationId,
        role: "user",
        content: message,
      });
      setMessage("");
      conversationQuery.refetch();
    } catch (error) {
      console.error("Failed to add message:", error);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-4 p-4">
      <Input type="text" value={did} placeholder="Enter DID" readOnly />
      <Button
        className="bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3"
        onClick={handleCreateConversation}
        disabled={createConversation.isPending}
      >
        Create Conversation
      </Button>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
      />
      <Button
        className="bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3"
        onClick={handleAddMessage}
        disabled={addMessage.isPending || !conversationId}
      >
        Add Message
      </Button>
      <Button
        className="bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3"
        onClick={() => conversationQuery.refetch()}
        disabled={conversationQuery.isFetching || !conversationId}
      >
        Refresh Conversation
      </Button>
      {conversationQuery.isSuccess && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Conversation:</h2>
          <div>
            {conversationQuery.data.messages.map((d) => {
              return (
                <div key={d.id}>
                  {d.role}: {d.content}
                </div>
              );
            })}
          </div>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(conversationQuery.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestPage;

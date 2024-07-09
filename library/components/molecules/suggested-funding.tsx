"use client";

import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import NewFundingFlow from "@/components/molecules/new-funding-flow";
import { getUserAddress } from "@/services/farcaster";

const SuggestedFundingHead = (suggestion: {
  content: string;
  updatedAt?: string;
}) => {
  return (
    <div className={"flex items-start flex-col gap-2 w-full"}>
      <Markdown className="prose text-left" remarkPlugins={[remarkGfm]}>
        {suggestion.content}
      </Markdown>
      {suggestion.updatedAt && (
        <p className="text-[#4C505F] text-sm italic text-end">
          {suggestion.updatedAt}
        </p>
      )}
    </div>
  );
};

interface ResolvedUser {
  username: string;
  address: string;
}

const SuggestedFundingBody = (suggestion: {
  content?: string;
  updatedAt?: string;
}) => {
  const [resolvedUsers, setResolvedUsers] = useState<ResolvedUser[]>([]);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const resolveAddresses = async () => {
      setDebugInfo(`Suggestion received: ${JSON.stringify(suggestion)}`);

      if (!suggestion?.content) {
        setDebugInfo((prevInfo) => `${prevInfo}\nNo content in suggestion`);
        setResolvedUsers([]);
        return;
      }

      // const regex = /https:\/\/warpcast\.com\/(\w+)\/([^/\s]+)/g;
      const regex = /https:\/\/warpcast\.com\/([\w.]+)\/([^\/\s]+)/g;

      const usernames: string[] = [];
      let match;
      while ((match = regex.exec(suggestion.content)) !== null) {
        if (match[1]) {
          usernames.push(match[1]);
        }
      }

      setDebugInfo(
        (prevInfo) => `${prevInfo}\nUsernames found: ${usernames.join(", ")}`,
      );

      const users = await Promise.all(
        usernames.map(async (username) => {
          try {
            const address = await getUserAddress(username);
            return address ? { username, address } : null;
          } catch (error) {
            console.error(`Error resolving address for ${username}:`, error);
            setDebugInfo(
              (prevInfo) =>
                `${prevInfo}\nError resolving ${username}: ${error}`,
            );
            return null;
          }
        }),
      );

      const filteredUsers = users.filter(
        (user): user is ResolvedUser => user !== null,
      );
      setResolvedUsers(filteredUsers);
      setDebugInfo(
        (prevInfo) =>
          `${prevInfo}\nResolved users: ${filteredUsers.map((u) => u.username).join(", ")}`,
      );
    };

    resolveAddresses();
  }, [suggestion, suggestion?.content]);

  if (!suggestion) {
    return <div className="text-gray-500 italic">No suggestion provided.</div>;
  }

  if (!suggestion.content) {
    return (
      <div className="text-gray-500 italic">
        No suggestion content available.
      </div>
    );
  }

  if (resolvedUsers.length === 0) {
    return (
      <div className="text-gray-500 italic">
        No funds to flow. Please check the suggestion for valid Warpcast
        usernames.
        {/* <pre className="mt-2 text-xs">{debugInfo}</pre> */}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {resolvedUsers.map((user, index) => (
        <NewFundingFlow
          key={index}
          username={user.username}
          address={user.address}
        />
      ))}
      {/* <pre className="mt-2 text-xs">{debugInfo}</pre> */}
    </div>
  );
};

export { SuggestedFundingBody, SuggestedFundingHead };

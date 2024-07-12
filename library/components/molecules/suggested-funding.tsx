"use client";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import NewFundingFlow from "@/components/molecules/new-funding-flow";
import { getUserAddress } from "@/services/farcaster";

const SuggestedFundingHead = (suggestion: {
  content: string;
  updatedAt: string;
}) => {
  const date = new Date(suggestion.updatedAt);
  const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

  return (
    <div className={"flex items-start flex-col gap-2 w-full"}>
      <Markdown className="prose text-left" remarkPlugins={[remarkGfm]}>
        {suggestion.content}
      </Markdown>
      {suggestion.updatedAt && (
        <p className="text-[#4C505F] text-sm italic text-end">
          {formattedDate}
        </p>
      )}
    </div>
  );
};

interface ResolvedUser {
  username: string;
  address: string;
}

const SuggestedFundingBody = (suggestion: { content?: string }) => {
  const [resolvedUsers, setResolvedUsers] = useState<ResolvedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveAddresses = async () => {
      setIsLoading(true);
      if (!suggestion?.content) {
        setResolvedUsers([]);
        setIsLoading(false);
        return;
      }

      const regex =
        /https:\/\/warpcast\.com\/([\w.]+(?:\.eth)?)(?:\/([^\/\s]+))?/g;
      const usernames: string[] = [];
      let match;
      while ((match = regex.exec(suggestion.content)) !== null) {
        if (match[1]) {
          usernames.push(match[1]);
        }
      }

      const users = await Promise.all(
        usernames.map(async (username) => {
          try {
            const address = await getUserAddress(username);
            return address ? { username, address } : null;
          } catch (error) {
            console.error(`Error resolving address for ${username}:`, error);
            return null;
          }
        }),
      );

      const filteredUsers = users.filter(
        (user): user is ResolvedUser => user !== null,
      );
      setResolvedUsers(filteredUsers);
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader className="animate-spin text-gray-500" size={24} />
      </div>
    );
  }

  if (resolvedUsers.length === 0) {
    return (
      <div className="text-gray-500 italic">
        No funds to flow. Please check the suggestion for valid Warpcast
        usernames.
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
    </div>
  );
};

export { SuggestedFundingBody, SuggestedFundingHead };

"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/atoms/button";
import Emoji from "@/components/atoms/emoji";
import { useFundingFlows } from "@/hooks/use-funding-flows";
import { FundingFlowState } from "@/types";
import { useAccount } from "wagmi";

const ActiveFundingHead = ({ flow }: { flow: FundingFlowState }) => {
  const { description, emojiCodePoint, token, allocation } = flow;
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-4">
        <Emoji
          emoji={emojiCodePoint}
          className="inline-block text-4xl !no-underline"
        />
        <div className="flex flex-col items-start">
          <h3 className="text-lg w-fit font-semibold text-gray-800">
            {description}
          </h3>
          <div className="flex gap-4">
            <span className="text-sm text-gray-600">{token?.symbol}</span>
            <span className="text-sm text-gray-600">{allocation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActiveFundingBody = ({
  flow,
  index,
}: {
  flow: FundingFlowState;
  index: number;
}) => {
  const { flow: conversationId } = useParams();
  const { address } = useAccount();
  const { deleteFundingFlow } = useFundingFlows(conversationId as string);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = () => {
    const baseUrl = window.location.origin;
    const encodedFlow = btoa(JSON.stringify({ ...flow, creator: address }));
    const fullUrl = `${baseUrl}/collect?new-flow=${encodedFlow}`;

    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-gray-600">To: {flow.recipient}</p>
        <p className="text-sm text-gray-600">Duration: {flow.duration}</p>
        {flow.description && <p className="text-sm">{flow.description}</p>}
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleCopyLink}
        >
          {copySuccess ? "Copied!" : "Copy Flow Link"}
        </Button>
        <Button
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => deleteFundingFlow(index)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export { ActiveFundingBody, ActiveFundingHead };

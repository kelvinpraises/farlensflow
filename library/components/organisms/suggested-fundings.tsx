"use client";
import React from "react";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import Card from "@/components/atoms/card";
import {
  SuggestedFundingBody,
  SuggestedFundingHead,
} from "@/components/molecules/suggested-funding";
import { useIndexNetwork } from "@/hooks/use-index-network";

const SuggestedFundings = () => {
  const { flow: conversationId } = useParams();
  const { conversationQuery } = useIndexNetwork(conversationId as string);
  const { isLoading, isError, isSuccess, data } = conversationQuery;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred while fetching data.</div>;
  }

  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="w-full flex flex-col gap-4"
      >
        {isSuccess &&
          data.messages.map((message) => (
            <Card
              key={message.id}
              className="rounded-lg p-0 transition-shadow hover:shadow-md"
            >
              <AccordionItem value={message.id} className="border-b-0">
                <AccordionTrigger className="p-4 hover:no-underline">
                  <SuggestedFundingHead
                    content={message.content}
                    updatedAt={message.updatedAt}
                  />
                </AccordionTrigger>
                <AccordionContent className="pb-4 px-4">
                  <SuggestedFundingBody content={message.content} />
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
      </Accordion>
    </div>
  );
};

export default SuggestedFundings;

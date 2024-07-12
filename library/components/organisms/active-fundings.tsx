"use client";

import { useParams } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import Card from "@/components/atoms/card";
import {
  ActiveFundingBody,
  ActiveFundingHead,
} from "@/components/molecules/active-funding";
import { useFundingFlows } from "@/hooks/use-funding-flows";

const ActiveFundings = () => {
  const { flow: conversationId } = useParams();
  const { fundingFlows } = useFundingFlows(conversationId as string);

  return (
    <div className="flex flex-col gap-4">
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Switch to the Suggestion tab, to see more initiatives you can flow
          funds to!
        </AlertDescription>
      </Alert>

      <Accordion type="multiple" className="w-full flex flex-col gap-2">
        {fundingFlows.map((flow, index) => (
          <Card key={flow.createdAt} className="rounded-lg p-0">
            <AccordionItem value={flow.createdAt} className="border-b-0">
              <AccordionTrigger className="p-4">
                <ActiveFundingHead flow={flow} />
              </AccordionTrigger>
              <AccordionContent className="pb-4 px-4">
                <ActiveFundingBody flow={flow} index={0} />
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default ActiveFundings;

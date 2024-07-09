"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import Card from "@/components/atoms/card";

import NewCollector from "@/components/molecules/new-collector";
import ConnectRecipient from "../molecules/connect-recipient";
import { Collector, Recipient } from "@/types";
import { CollectorBody, CollectorHead } from "@/components/molecules/collector";

interface CollectorsProps {
  collectors: Collector[];
  recipients: Recipient[];
}

const Collectors: React.FC<CollectorsProps> = ({ collectors, recipients }) => {
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-end">
        <NewCollector />
        <ConnectRecipient
          selectedRecipient={selectedRecipient}
          setSelectedRecipient={setSelectedRecipient}
          demoRecipients={recipients}
        />
      </div>
      <Accordion type="multiple" className="w-full flex flex-col gap-2">
        {collectors.map((collector) => (
          <Card key={collector.id} className="rounded-lg p-0">
            <AccordionItem
              key={collector.id}
              value={collector.id}
              className="border-b-0"
            >
              <AccordionTrigger className="p-4">
                <CollectorHead collector={collector} />
              </AccordionTrigger>
              <AccordionContent className="pb-4 px-4">
                <CollectorBody
                  collector={collector}
                  selectedRecipient={selectedRecipient}
                />
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default Collectors;

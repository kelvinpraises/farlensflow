"use client";

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
import { Funding } from "@/types";

const sampleFunds: Funding[] = [
  {
    id: "happy",
    name: "Title 1",
    emojiCodePoint: "1F31F", // 🌟
    creator: "0x123...",
    status: "Open",
    created_at: Date.now(),
    updated_at: Date.now(),
    rate: 1.5,
    description: "Sample fund 1",
    startTimestamp: Date.now(),
    endTimestamp: Date.now() + 86400000, // 1 day later
    token: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x...",
    },
    amount: "1000",
    selectedMerchants: [],
  },
  {
    id: "happy0",
    name: "Title 2",
    emojiCodePoint: "1F680", // 🚀
    creator: "0x456...",
    status: "Closed",
    created_at: Date.now() - 86400000, // 1 day ago
    updated_at: Date.now(),
    rate: 2.0,
    description: "Sample fund 2",
    startTimestamp: Date.now() - 86400000,
    endTimestamp: Date.now(),
    token: {
      symbol: "ETH",
      name: "Ethereum",
      address: "0x...",
    },
    amount: "5",
    selectedMerchants: [],
  },
  {
    id: "happy1",
    name: "Title 3",
    emojiCodePoint: "1F308", // 🌈
    creator: "0x789...",
    status: "Open",
    created_at: Date.now() - 172800000, // 2 days ago
    updated_at: Date.now(),
    rate: 1.8,
    description: "Sample fund 3",
    startTimestamp: Date.now() - 172800000,
    endTimestamp: Date.now() + 172800000,
    token: {
      symbol: "DAI",
      name: "Dai Stablecoin",
      address: "0x...",
    },
    amount: "2000",
    selectedMerchants: [],
  },
  {
    id: "happy2",
    name: "Title 4",
    emojiCodePoint: "1F525", // 🔥
    creator: "0xabc...",
    status: "Open",
    created_at: Date.now() - 259200000, // 3 days ago
    updated_at: Date.now(),
    rate: 2.2,
    description: "Sample fund 4",
    startTimestamp: Date.now() - 259200000,
    endTimestamp: Date.now() + 259200000,
    token: {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      address: "0x...",
    },
    amount: "0.1",
    selectedMerchants: [],
  },
];

const ActiveFundings = () => {
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
        {sampleFunds.map((item) => (
          <Card key={item.id} className="rounded-lg p-0">
            <AccordionItem value={item.id} className="border-b-0">
              <AccordionTrigger className="p-4">
                <ActiveFundingHead item={item} />
              </AccordionTrigger>
              <AccordionContent className="pb-4 px-4">
                <ActiveFundingBody item={item} />
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default ActiveFundings;

"use client";

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
import { Conversation } from "@/types";

type PartialMessage = Partial<Conversation["messages"][0]>;

const suggestions: PartialMessage[] = [
  {
    id: "ceramic",
    role: "assistant",
    updatedAt: "1625097600",
    content:
      "**ceramic** - [Posted a viral meme on AI advancements that got over 10k likes.](https://warpcast.com/ceramic/0xab123456)\n\nThe meme quickly caught the attention of the tech community, showcasing the rapid developments in AI technology.",
  },
  {
    id: "bias",
    role: "assistant",
    updatedAt: "1625097600",
    content:
      "**bias** - [Created a series of memes about blockchain technology, gaining significant traction.](https://warpcast.com/bias/0xcd789012)\n\nThese memes highlighted the complexities and potential of blockchain in an engaging and humorous way.",
  },
  {
    id: "brianjckim",
    role: "assistant",
    updatedAt: "1625097600",
    content:
      "**brianjckim** - [Known for clever wordplay memes, recently hit 5k followers.](https://warpcast.com/brianjckim/0xef345678)\n\nTheir content is beloved for its witty and intellectual humor, appealing to a niche audience.",
  },
  {
    id: "drewcoffman.eth",
    role: "assistant",
    updatedAt: "1625097600",
    content:
      "**drewcoffman.eth** - [Shared a hilarious GIF series about crypto trading, went viral.](https://warpcast.com/drewcoffman.eth/0x123abc45)\n\nThe GIFs humorously depicted the highs and lows of crypto trading, resonating with many traders.",
  },
  {
    id: "woj.eth",
    role: "assistant",
    updatedAt: "1625097600",
    content:
      "**woj.eth** - [Famous for witty and timely meme reactions, popular post about NFT trends.](https://warpcast.com/woj.eth/0x456def67)\n\nTheir memes capture the essence of trending topics in the NFT space, often sparking lively discussions.",
  },
  {
    id: "ispeaknerd.eth",
    role: "assistant",
    updatedAt: "1625097600",
    content:
      "**ispeaknerd.eth** - [Created a meme thread on the future of digital currencies, widely shared.](https://warpcast.com/ispeaknerd.eth/0x78901234)\n\nThis thread delved into speculative and futuristic scenarios, engaging a broad audience.",
  },
  {
    id: "chicago",
    role: "assistant",
    updatedAt: "1625097600",
    content:
      "**chicago** - [Satirical memes about tech industry insiders, rapidly gaining followers.](https://warpcast.com/chicago/0x90123456)\n\nTheir satirical take on industry leaders and trends provides sharp, humorous commentary.",
  },
  {
    id: "farcasteradmin.eth",
    role: "assistant",
    updatedAt: "1625097600",
    content:
      "**farcasteradmin.eth** - [Posted a meme about the latest DAO developments, highly praised.](https://warpcast.com/farcasteradmin.eth/0xabcd5678)\n\nTheir meme provided insightful commentary on decentralized autonomous organizations.",
  },
  {
    id: "artlu",
    role: "assistant",
    updatedAt: "1625097600",
    content:
      "**artlu** - [Digital art memes, particularly about DeFi, getting a lot of attention.](https://warpcast.com/artlu/0xefgh9012)\n\nTheir digital art memes are known for their creativity and relevance to the DeFi space.",
  },
  {
    id: "binji",
    role: "assistant",
    updatedAt: "1625097600",
    content:
      "**binji** - [Shared a meme on metaverse trends, engagement spiked.](https://warpcast.com/binji/0xijkl3456)\n\nThis meme captured the growing interest and developments in the metaverse.",
  },
];

const SuggestedFundings = () => {
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        className="w-full flex flex-col gap-4"
      >
        {suggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            className="rounded-lg p-0 transition-shadow hover:shadow-md"
          >
            <AccordionItem value={suggestion.id!} className="border-b-0">
              <AccordionTrigger className="p-4 hover:no-underline">
                <SuggestedFundingHead
                  {...(suggestion?.content && { ...(suggestion as any) })}
                />
              </AccordionTrigger>
              <AccordionContent className="pb-4 px-4">
                <SuggestedFundingBody
                  {...(suggestion?.content && { ...(suggestion as any) })}
                />
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default SuggestedFundings;

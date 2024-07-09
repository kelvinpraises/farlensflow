import { SIWEConfig } from "connectkit";
import { Address } from "viem";

export type SIWESession = {
  address: Address;
  chainId: number;
  did?: string;
};

export interface CustomSIWEConfig extends Omit<SIWEConfig, "getSession"> {
  getSession: () => Promise<SIWESession | null>;
}

export interface AcceptedToken {
  address: string;
  name: string;
  symbol: string;
}

export interface FundingFlow {
  id: string;
  name: string;
  amount: number;
  imageUrl: string;
}

export interface Funding {
  id: string;
  name: string;
  emojiCodePoint: string;
  creator: string;
  status: "Open" | "Closed";
  created_at: number;
  updated_at: number;
  rate: number;
  description: string;
  startTimestamp: number;
  endTimestamp: number;
  token: {
    symbol: string;
    name: string;
    address: string;
  };
  amount: string;
  selectedMerchants: string[];
}

export interface FundRecipient {
  address: string;
  name: string;
  status:
    | "None"
    | "Pending"
    | "Accepted"
    | "Rejected"
    | "Appealed"
    | "InReview";
}

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

export type Token = {
  symbol: string;
  name: string;
  address: Address;
  amount?: string;
};

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

// services/index-network.ts

export interface Conversation {
  id: string;
  controllerDID: {
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  members: Array<{ id: string }>;
  messages: Array<{
    id: string;
    controllerDID: {
      id: string;
    };
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    role: string;
    content: string;
    name?: string;
  }>;
  sources: string[];
  summary: string;
}

export interface CreateConversationParams {
  summary: string;
  sources: string[];
  members: string[];
}

export interface AddMessageParams {
  role: string;
  content: string;
}

export interface FundingFlowState {
  address: string;
  emojiCodePoint: string;
  token: Token | null;
  description: string;
  duration: string;
  allocation: string;
  recipientAddress: string;
  createdAt: string;
}

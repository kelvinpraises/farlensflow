import {
  CreateConversationParams,
  Conversation,
  AddMessageParams,
} from "@/types";

const BASE_URL = "https://index.network/api";

export class IndexNetworkService {
  private did: string;

  constructor(did: string) {
    this.did = did;
  }

  private async fetchWithAuth(
    url: string,
    options: RequestInit,
  ): Promise<Response> {
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${this.did}`);
    headers.set("Content-Type", "application/json");

    return fetch(url, { ...options, headers });
  }

  async createConversation(
    params: CreateConversationParams,
  ): Promise<Conversation> {
    const response = await this.fetchWithAuth(`${BASE_URL}/conversations`, {
      method: "POST",
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to create conversation: ${response.statusText}`);
    }

    return response.json();
  }

  async addMessageToConversation(
    conversationId: string,
    params: AddMessageParams,
  ): Promise<Conversation["messages"][0]> {
    const response = await this.fetchWithAuth(
      `${BASE_URL}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify(params),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to add message: ${response.statusText}`);
    }

    return response.json();
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await this.fetchWithAuth(
      `${BASE_URL}/conversations/${conversationId}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to get conversation: ${response.statusText}`);
    }

    return response.json();
  }

  async getConversations(): Promise<Conversation[]> {
    const response = await this.fetchWithAuth(`${BASE_URL}/conversations`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to get conversation: ${response.statusText}`);
    }

    return response.json();
  }
}

export const createIndexNetworkService = (did: string) =>
  new IndexNetworkService(did);

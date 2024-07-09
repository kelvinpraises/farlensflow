import { Token } from "@/types";
import { Address } from "viem";

export class AlchemyService {
  private address: string;
  private networkId: string;
  private apiKey: string;

  constructor(address: string, networkId: string, apiKey: string) {
    this.address = address;
    this.networkId = networkId;
    this.apiKey = apiKey;
  }

  async fetchTokens(): Promise<Token[]> {
    const url = `https://${this.networkId}.g.alchemy.com/v2/${this.apiKey}`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        params: [this.address],
      }),
    };

    let response = await fetch(url, options);
    let result = await response.json();

    console.log("result: ", result);

    const balances = result["result"].tokenBalances;
    const nonZeroBalances = balances.filter(
      (token: { tokenBalance: string }) => {
        return token.tokenBalance !== "0";
      },
    );

    let tokens: Token[] = [];
    for (let token of nonZeroBalances) {
      const metadata = await this.fetchTokenMetadata(token.contractAddress);

      const balance =
        parseFloat(token.tokenBalance) / Math.pow(10, metadata.decimals);
      tokens.push({
        symbol: metadata.symbol,
        name: metadata.name,
        address: token.contractAddress,
        amount: balance.toFixed(2),
      });
    }

    console.log("tokens: ", tokens);

    return tokens;
  }

  private async fetchTokenMetadata(contractAddress: string): Promise<any> {
    const url = `https://${this.networkId}.g.alchemy.com/v2/${this.apiKey}`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenMetadata",
        params: [contractAddress],
      }),
    };

    let response = await fetch(url, options);
    let result = await response.json();
    console.log("result 2: ", result);

    return result["result"];
  }
}

export const createAlchemyService = (props: {
  address: Address;
  networkId: string;
  apiKey: string;
}) => new AlchemyService(props.address, props.networkId, props.apiKey);

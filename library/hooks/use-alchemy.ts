import { useQuery } from "@tanstack/react-query";

import { createAlchemyService } from "@/services/alchemy";
import { Token } from "@/types";
import { useAccount } from "wagmi";

export const useAlchemy = () => {
  const account = useAccount();

  const supportedNetworks: { [key: number]: string } = {
    11155111: "eth-sepolia",
    84532: "base-sepolia",
  };

  const service =
    account.address &&
    account.chain &&
    account.chainId &&
    process.env.NEXT_PUBLIC_ALCHEMY_KEY
      ? createAlchemyService({
          address: account.address,
          networkId: supportedNetworks[account.chainId],
          apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
        })
      : null;

  const tokensQuery = useQuery<Token[], Error>({
    queryKey: ["tokens"],
    queryFn: async () => {
      if (!service) throw new Error("Undefined config passed");
      return service.fetchTokens();
    },
    enabled: !!service,
  });

  return { tokensQuery };
};

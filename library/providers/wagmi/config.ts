import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { mainnet, baseSepolia, sepolia, anvil } from "wagmi/chains";

export const config = createConfig(
  getDefaultConfig({
    appName: "Farlensflow",
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    chains: [mainnet, sepolia, baseSepolia, anvil],
    multiInjectedProviderDiscovery: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [baseSepolia.id]: http(),
      [anvil.id]: http(),
    },
  }),
);

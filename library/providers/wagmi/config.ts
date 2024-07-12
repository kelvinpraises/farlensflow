import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { anvil, baseSepolia } from "wagmi/chains";

export const config = createConfig(
  getDefaultConfig({
    appName: "Farlensflow",
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    chains: [baseSepolia, anvil],
    multiInjectedProviderDiscovery: true,
    transports: {
      [baseSepolia.id]: http(),
      [anvil.id]: http(),
    },
  }),
);

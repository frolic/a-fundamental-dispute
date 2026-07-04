import "@rainbow-me/rainbowkit/styles.css";

import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import * as allChains from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

// Will default to mainnet if nothing set in the ENV
export const targetChainId =
  parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "0") || 1;

export const targetChain = (() => {
  const c = Object.values(allChains).find((c) => c.id === targetChainId);
  if (!c) {
    throw new Error(`No chain config found for chain ID ${targetChainId}`);
  }
  return c;
})();

// filter down to just mainnet + optional target testnet chain so that rainbowkit can tell
// the user to switch network if they're on an alternative one
const targetChains = [targetChain, allChains.mainnet];

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  targetChains,
  [
    // wagmi's alchemyProvider points at the retired alchemyapi.io domain, so
    // configure Alchemy's current domain by hand
    jsonRpcProvider({
      rpc: (chain) =>
        alchemyApiKey && chain.id === allChains.mainnet.id
          ? { http: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}` }
          : null,
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "A Fundamental Dispute",
  // WalletConnect-based wallets need a real project ID from
  // https://cloud.walletconnect.com — browser wallets work without one
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
    "00000000000000000000000000000000",
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

type Props = {
  children: React.ReactNode;
};

export const EthereumProviders = ({ children }: Props) => (
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains} theme={darkTheme()}>
      {children}
    </RainbowKitProvider>
  </WagmiConfig>
);

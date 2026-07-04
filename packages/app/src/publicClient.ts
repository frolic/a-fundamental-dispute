import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

/** Server-side chain reads (API routes, getServerSideProps). */
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(
    alchemyApiKey
      ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
      : undefined
  ),
});

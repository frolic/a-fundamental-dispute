import mainnetDeploys from "@web3-scaffold/contracts/deploys/mainnet.json";
import { getAddress } from "viem";

import { generateImages } from "./generateImages";

const rpcUrl = process.env.RPC_HTTP_URL_1;
if (!rpcUrl) {
  throw new Error("RPC_HTTP_URL_1 is not set");
}

generateImages({
  rpcUrl,
  tokenAddress: getAddress(mainnetDeploys.AFundamentalDispute.contractAddress),
  rendererAddress: getAddress(mainnetDeploys.AFDRenderer.contractAddress),
}).catch((error) => {
  console.error(error);
  process.exit(1);
});

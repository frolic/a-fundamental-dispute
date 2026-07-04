import mainnetDeploys from "@web3-scaffold/contracts/deploys/mainnet.json";
import { getAddress } from "viem";

import { rendererAbi, tokenAbi } from "./abis";
import { targetChainId } from "./EthereumProviders";

export const getContracts = () => {
  if (targetChainId === 1) {
    return {
      AFundamentalDispute: {
        chainId: targetChainId,
        address: getAddress(mainnetDeploys.AFundamentalDispute.contractAddress),
        abi: tokenAbi,
      },
      AFDRenderer: {
        chainId: targetChainId,
        address: getAddress(mainnetDeploys.AFDRenderer.contractAddress),
        abi: rendererAbi,
      },
    };
  }
  throw new Error("Unsupported chain ID");
};

export const contracts = getContracts();

import { Address, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import { rendererAbi, tokenAbi } from "./abis";
import { closeBrowser, createImage } from "./createImage";
import { hasImage } from "./hasImage";
import { storeManifest } from "./storeManifest";

/**
 * Renders any token images missing from the bucket and refreshes the token
 * manifest, sourcing all data from the chain so no indexer is needed.
 */
export const generateImages = async ({
  rpcUrl,
  tokenAddress,
  rendererAddress,
}: {
  rpcUrl: string;
  tokenAddress: Address;
  rendererAddress: Address;
}) => {
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  });

  console.log("fetching token seeds");
  const totalSupply = await publicClient.readContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "totalSupply",
  });
  const tokenIds = Array.from(
    { length: Number(totalSupply) },
    (_, index) => index + 1
  );
  const seeds = await publicClient.multicall({
    contracts: tokenIds.map((tokenId) => ({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: "tokenSeed",
      args: [BigInt(tokenId)],
    })),
    allowFailure: false,
  });
  const tokens = tokenIds.map((tokenId, index) => ({
    tokenId,
    seed: Number(seeds[index]),
  }));

  console.log("finding tokens without images");
  const tokensToGenerate = (
    await Promise.all(
      tokens.map(async (token) => ({
        token,
        exists: await hasImage(rendererAddress, token.tokenId, token.seed),
      }))
    )
  )
    .filter(({ exists }) => !exists)
    .map(({ token }) => token);

  const failedTokenIds: number[] = [];
  if (tokensToGenerate.length) {
    console.log(
      "generating images for",
      tokensToGenerate.map((token) => token.tokenId)
    );
    const batchSize = 8;
    for (let i = 0; i < tokensToGenerate.length; i += batchSize) {
      await Promise.all(
        tokensToGenerate.slice(i, i + batchSize).map(async (token) => {
          try {
            const html = await publicClient.readContract({
              address: rendererAddress,
              abi: rendererAbi,
              functionName: "fullscreenHtml",
              args: [BigInt(token.tokenId)],
            });
            await createImage(rendererAddress, token.tokenId, token.seed, html);
          } catch (error) {
            console.error(`error generating image for ${token.tokenId}`, error);
            failedTokenIds.push(token.tokenId);
          }
        })
      );
    }
    await closeBrowser();
  } else {
    console.log("no new tokens");
  }

  console.log("updating manifest");
  await storeManifest(rendererAddress, tokens);

  if (failedTokenIds.length) {
    throw new Error(`failed to generate images for ${failedTokenIds}`);
  }

  console.log("done");
};

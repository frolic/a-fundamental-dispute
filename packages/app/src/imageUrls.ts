import mainnetDeploys from "@web3-scaffold/contracts/deploys/mainnet.json";

const baseUrl = `https://afd-images.nyc3.cdn.digitaloceanspaces.com/${mainnetDeploys.AFDRenderer.contractAddress.toLowerCase()}`;

export const previewImageUrl = (tokenId: number, seed: number) =>
  `${baseUrl}/${tokenId}/${seed}.jpg`;

export const tokensManifestUrl = `${baseUrl}/tokens.json`;

import { useContractRead } from "wagmi";

import { contracts } from "./contracts";
import { TextLink } from "./TextLink";
import { useENS } from "./useENS";
import { useIsMounted } from "./useIsMounted";

type Props = {
  tokenId: number;
  owner?: string;
};

export const TokenOwner = ({ tokenId, owner }: Props) => {
  const isMounted = useIsMounted();

  const ownerRead = useContractRead({
    ...contracts.AFundamentalDispute,
    functionName: "ownerOf",
    args: [BigInt(tokenId)],
    enabled: isMounted && !owner,
  });

  const { address, displayName } = useENS(
    isMounted ? owner ?? ownerRead.data : undefined
  );
  if (!address) {
    return (
      <>
        {owner?.replace(/^(0x[0-9A-F]{3})[0-9A-F]+([0-9A-F]{4})$/i, "$1…$2") ??
          "??"}
      </>
    );
  }

  return (
    <TextLink
      href={`https://opensea.io/${address}`}
      target="_blank"
      title={address}
    >
      {displayName}
    </TextLink>
  );
};

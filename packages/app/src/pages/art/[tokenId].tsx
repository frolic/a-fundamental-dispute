import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { ArtPreview } from "../../ArtPreview";
import { maxSupply } from "../../constants";
import { contracts } from "../../contracts";
import { publicClient } from "../../publicClient";
import { TextLink } from "../../TextLink";
import { TokenOwner } from "../../TokenOwner";
import { TopBar } from "../../TopBar";

type Props = {
  tokenId: number;
  seed?: number;
  owner?: string;
};

export const getServerSideProps: GetServerSideProps<
  Props,
  { tokenId: string }
> = async (context) => {
  const id = context.params?.tokenId;
  if (!id || !/^\d+$/.test(id)) return { notFound: true };

  const tokenId = parseInt(id);
  if (tokenId < 1 || tokenId > maxSupply) return { notFound: true };

  try {
    const [owner, seed] = await Promise.all([
      publicClient.readContract({
        ...contracts.AFundamentalDispute,
        functionName: "ownerOf",
        args: [BigInt(tokenId)],
      }),
      publicClient.readContract({
        ...contracts.AFundamentalDispute,
        functionName: "tokenSeed",
        args: [BigInt(tokenId)],
      }),
    ]);
    return {
      props: {
        tokenId,
        seed,
        owner,
      },
    };
  } catch (error) {
    console.error("Error looking up token", tokenId, error);
    return {
      props: {
        tokenId,
      },
    };
  }
};

const ArtPage: NextPage<Props> = ({ tokenId, seed, owner }) => (
  <>
    <Head>
      {/* Using string interpolation here because Next.js complains if <title> has multiple children/nodes */}
      <title>{`${tokenId}/${maxSupply} — A Fundamental Dispute`}</title>

      <meta
        property="og:title"
        content={`${tokenId}/${maxSupply} — A Fundamental Dispute`}
      />
      <meta
        property="og:description"
        content="— a series of digital sunsets living inside the world computer."
      />

      <meta
        property="og:image"
        content={`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/art-placeholder/${tokenId}`}
      />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="1100" />
    </Head>
    <TopBar />
    <div className="min-h-screen flex flex-col items-center justify-center p-[8vw]">
      <div className="w-full max-w-[1000px] flex flex-col gap-2">
        <div className="flex justify-end">
          {tokenId}/{maxSupply}
        </div>
        <div className="aspect-[400/550] relative">
          {tokenId && seed ? (
            <ArtPreview tokenId={tokenId} seed={seed} />
          ) : null}
        </div>
        <div className="flex justify-between">
          <span>
            Owned by <TokenOwner tokenId={tokenId} owner={owner} />
          </span>
          <span>
            <TextLink
              href={`https://opensea.io/assets/ethereum/${contracts.AFundamentalDispute.address}/${tokenId}`}
              target="_blank"
            >
              View on OpenSea ⇒
            </TextLink>
          </span>
        </div>
      </div>
    </div>
  </>
);

export default ArtPage;

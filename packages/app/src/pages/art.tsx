import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { Gallery, Token } from "../Gallery";
import { tokensManifestUrl } from "../imageUrls";
import { TopBar } from "../TopBar";

type Props = {
  tokens: Token[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const tokens: Token[] = await fetch(tokensManifestUrl).then((res) =>
    res.json()
  );
  return {
    props: {
      tokens,
    },
  };
};

const GalleryPage: NextPage<Props> = ({ tokens }) => (
  <>
    <Head>
      <title>Gallery — A Fundamental Dispute</title>

      <meta property="og:title" content="Gallery — A Fundamental Dispute" />
      <meta
        property="og:description"
        content="— a series of digital sunsets living inside the world computer."
      />

      <meta
        property="og:image"
        content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/thumbnail-2.jpg`}
      />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="1100" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@generativelight" />
    </Head>
    <TopBar />
    <Gallery tokens={tokens} />
  </>
);

export default GalleryPage;

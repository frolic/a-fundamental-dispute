import type { NextPage } from "next";
import Head from "next/head";

import { OpenSeaIcon } from "../icons/OpenSeaIcon";
import { TextLink } from "../TextLink";

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>A Fundamental Dispute</title>

        <meta
          name="description"
          content="— a series of digital sunsets living inside the world computer."
        />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="A Fundamental Dispute" />
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
      <div className="space-y-16 px-8 py-12 sm:px-12 sm:py-16 md:px-16 md:py-20 lg:px-20 lg:py-24 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-lg font-bold text-white">
              A Fundamental Dispute
            </h1>
            <p className="italic">
              &mdash;{" "}
              <span
                className="transition relative group sm:cursor-help sm:underline underline-offset-2 decoration-dotted decoration-stone-700 sm:hover:text-stone-500 sm:focus:text-stone-500"
                tabIndex={-1}
              >
                a series of digital sunsets
                <span
                  aria-hidden
                  className="text-stone-500 pointer-events-none transition block opacity-0 sm:group-hover:opacity-100 sm:group-focus:opacity-100 absolute top-full left-4 whitespace-nowrap"
                >
                  ↳{" "}
                  <span className="text-yellow-100">
                    long-form generative artwork using p5.js
                  </span>
                </span>
              </span>{" "}
              <span
                className="transition relative group sm:cursor-help sm:underline underline-offset-2 decoration-dotted decoration-stone-700 sm:hover:text-stone-500 sm:focus:text-stone-500"
                tabIndex={-1}
              >
                living inside the world computer
                <span
                  aria-hidden
                  className="text-stone-500 pointer-events-none transition block opacity-0 sm:group-hover:opacity-100 sm:group-focus:opacity-100 absolute top-full left-4 whitespace-nowrap"
                >
                  ↳{" "}
                  <span className="text-yellow-100">
                    made fully on-chain with EthFS
                  </span>
                </span>
              </span>
              .
            </p>
          </div>

          <p>
            Art by{" "}
            <TextLink
              href="https://twitter.com/generativelight"
              target="_blank"
            >
              Adam
            </TextLink>
            , website and contracts{" "}
            <span className="whitespace-nowrap">
              by{" "}
              <TextLink href="https://twitter.com/frolic" target="_blank">
                frolic
              </TextLink>
              .
            </span>
          </p>

          <hr className="border-1 border-stone-800" />

          <div className="flex justify-between gap-8">
            <div>
              <p>
                <TextLink href="/about">Learn about the collection ⇒</TextLink>
              </p>
              <p>
                <TextLink href="/art">View the gallery ⇒</TextLink>
              </p>
            </div>
            <div>
              <a
                href="https://opensea.io/collection/a-fundamental-dispute"
                target="_blank"
                rel="noreferrer noopener"
                className="text-2xl opacity-60 transition hover:opacity-100 hover:text-white"
                title="View the collection on OpenSea"
              >
                <OpenSeaIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
          <img src="/thumbnail-1.jpg" />
          <img src="/thumbnail-2.jpg" />
          <img src="/thumbnail-3.jpg" />
          <img src="/thumbnail-4.jpg" />
        </div>
      </div>
    </>
  );
};

export default HomePage;

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DateTime } from "luxon";
import type { NextPage } from "next";
import Head from "next/head";
import { useSwitchNetwork } from "wagmi";

import { ButtonLink } from "../ButtonLink";
import { DisputableTokens } from "../DisputableTokens";
import { targetChainId } from "../EthereumProviders";
import { PendingIcon } from "../icons/PendingIcon";
import { TopBar } from "../TopBar";
import { useLastDispute } from "../useLastDispute";

const DisputePage: NextPage = () => {
  const { switchNetwork } = useSwitchNetwork();
  const { canDispute, disputesLeft, lastDisputeBlock, blocksUntilNextDispute } =
    useLastDispute();
  return (
    <>
      <Head>
        <title>Dispute</title>
      </Head>
      <TopBar />
      <div className="space-y-16 px-8 py-12 sm:px-12 sm:py-16 md:px-16 md:py-20 lg:px-20 lg:py-24">
        <ConnectButton.Custom>
          {({ mounted, account, chain, openConnectModal }) => {
            if (!mounted) {
              return <PendingIcon />;
            }

            if (!account) {
              return (
                <ButtonLink onClick={openConnectModal}>
                  Connect wallet ⇒
                </ButtonLink>
              );
            }

            if (chain && chain.id !== targetChainId) {
              return (
                <ButtonLink onClick={() => switchNetwork?.(targetChainId)}>
                  Switch network ⇒
                </ButtonLink>
              );
            }

            if (disputesLeft != null && disputesLeft <= 0) {
              return <p>It&apos;s time to listen…</p>;
            }
            if (!canDispute || !lastDisputeBlock) {
              if (blocksUntilNextDispute) {
                return (
                  <p>
                    Now is not the time. Check back{" "}
                    {DateTime.now()
                      .plus({
                        seconds: blocksUntilNextDispute * 12,
                      })
                      .toRelative()}
                    …
                  </p>
                );
              }
              return <p>Now is not the time…</p>;
            }
            return <DisputableTokens lastDispute={lastDisputeBlock} />;
          }}
        </ConnectButton.Custom>
      </div>
    </>
  );
};

export default DisputePage;

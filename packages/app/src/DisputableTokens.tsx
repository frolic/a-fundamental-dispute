import { BigNumber } from "ethers";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAccount, useContractRead, useContractWrite } from "wagmi";

import { maxSupply } from "./constants";
import { contracts } from "./contracts";
import { PendingIcon } from "./icons/PendingIcon";

type Props = {
  lastDispute: number;
};

export const DisputableTokens = ({ lastDispute }: Props) => {
  const { address } = useAccount();

  const tokensOfOwner = useContractRead({
    ...contracts.AFundamentalDispute,
    functionName: "tokensOfOwner",
    args: address && [address],
    enabled: !!address,
  });

  const { writeAsync } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...contracts.AFundamentalDispute,
    functionName: "dispute",
  });

  if (tokensOfOwner.error) {
    return <p>Error: {tokensOfOwner.error.message}</p>;
  }

  if (!tokensOfOwner.data) {
    return <PendingIcon />;
  }

  const tokenIds = tokensOfOwner.data.map((tokenId) => tokenId.toNumber());
  if (!tokenIds.length) {
    return <p>There is nothing to dispute…</p>;
  }

  return (
    <div className="flex flex-wrap gap-12">
      {tokenIds.map((tokenId) => (
        <div key={tokenId} className="grid relative">
          <img
            src={`/api/art-placeholder/${tokenId}`}
            width="200"
            height="275"
            className="row-start-1 col-start-1 bg-stone-900"
          />
          <button
            className="row-start-1 col-start-1 bg-stone-900/80 sm:opacity-0 sm:hover:opacity-100 transition"
            onClick={async (event) => {
              event.preventDefault();
              const toastId = toast.loading("Thinking…");
              try {
                if (!writeAsync) {
                  throw new Error("Not connected");
                }

                const { signature } = await fetch("/api/dispute-signature", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    address,
                    tokenId,
                    lastDispute,
                  }),
                }).then(
                  (res) => res.json() as Promise<{ signature: `0x${string}` }>
                );
                toast.update(toastId, { render: "Disputing…" });

                const tx = await writeAsync({
                  recklesslySetUnpreparedArgs: [
                    BigNumber.from(tokenId),
                    signature,
                  ],
                });
                toast.update(toastId, { render: "Awaiting reply…" });

                const receipt = await tx.wait();
                toast.update(toastId, {
                  isLoading: false,
                  type: "success",
                  render: (
                    <>
                      Your piece has fundamental changed.{" "}
                      <Link href={`/art/${tokenId.toString()}`}>
                        <a
                          className="underline"
                          onClick={() => toast.dismiss()}
                        >
                          View your piece &rarr;
                        </a>
                      </Link>
                    </>
                  ),
                  autoClose: 15000,
                  closeButton: true,
                });
              } catch (error: any) {
                toast.update(toastId, {
                  isLoading: false,
                  type: "error",
                  render: String(error.message),
                  autoClose: 15000,
                  closeButton: true,
                });
              }
            }}
          >
            <span className="text-white bg-amber-800 px-4 py-2">Dispute</span>
          </button>
          <span className="absolute bottom-full right-0 text-sm leading-relaxed">
            {tokenId}/{maxSupply}
          </span>
        </div>
      ))}
    </div>
  );
};

import type { NextApiRequest, NextApiResponse } from "next";
import { encodeAbiParameters, Hex, isAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const sharedSignerPrivateKey = process.env.SHARED_SIGNER_PRIVATE_KEY;
  if (!sharedSignerPrivateKey) {
    return res.status(500).send({ error: "signer not configured" });
  }
  const signer = privateKeyToAccount(sharedSignerPrivateKey as Hex);

  const address = req.body.address as string;
  if (!address || !isAddress(address)) {
    return res.status(400).send({ error: "missing address" });
  }

  const tokenId = req.body.tokenId as number;
  if (!tokenId) {
    return res.status(400).send({ error: "missing tokenId" });
  }

  const lastDispute = req.body.lastDispute as number;
  if (!lastDispute) {
    return res.status(400).send({ error: "missing lastDispute" });
  }

  const encoded = encodeAbiParameters(
    [{ type: "address" }, { type: "uint256" }, { type: "uint256" }],
    [address, BigInt(tokenId), BigInt(lastDispute)]
  );

  return res.send({
    signature: await signer.signMessage({ message: { raw: encoded } }),
  });
};

export default handler;

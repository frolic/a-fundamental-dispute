import { PutObjectCommand } from "@aws-sdk/client-s3";

import { s3Client } from "./s3Client";

/**
 * Uploads the full tokenId→seed list alongside the images so the app can
 * enumerate tokens without an indexer.
 */
export const storeManifest = async (
  rendererAddress: string,
  tokens: { tokenId: number; seed: number }[]
) => {
  const key = `${rendererAddress.toLowerCase()}/tokens.json`;
  await s3Client.send(
    new PutObjectCommand({
      Bucket: "afd-images",
      Key: key,
      Body: JSON.stringify(tokens),
      ACL: "public-read",
      ContentType: "application/json",
      CacheControl: "max-age=300",
    })
  );
  console.log("Stored manifest", key, `(${tokens.length} tokens)`);
};

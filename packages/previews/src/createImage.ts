import { PutObjectCommand } from "@aws-sdk/client-s3";
import puppeteer, { Browser } from "puppeteer";

import { getCacheKey } from "./getCacheKey";
import { s3Client } from "./s3Client";

let browser: Promise<Browser> | null = null;

export const createImage = async (
  rendererAddress: string,
  tokenId: number,
  seed: number,
  html: string
) => {
  const width = 400;
  const height = 550;
  const pixelDensity = 2;

  const cacheKey = getCacheKey(rendererAddress, tokenId, seed);

  if (!browser) {
    console.log("Starting browser instance");
    browser = puppeteer.launch({ headless: true });
  }

  console.log("Rendering", cacheKey);
  console.time(`Rendered ${cacheKey}`);
  const page = await (await browser).newPage();
  try {
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: pixelDensity,
    });

    await page.setContent(html);
    await page.waitForNetworkIdle();
    await page.waitForFunction("window.renderComplete === true");
    console.timeEnd(`Rendered ${cacheKey}`);

    const png = await page.screenshot({ type: "png" });
    const jpg = await page.screenshot({ type: "jpeg" });

    await Promise.all([
      s3Client.send(
        new PutObjectCommand({
          Bucket: "afd-images",
          Key: `${cacheKey}.png`,
          Body: png,
          ACL: "public-read",
          ContentType: "image/png",
        })
      ),
      s3Client.send(
        new PutObjectCommand({
          Bucket: "afd-images",
          Key: `${cacheKey}.jpg`,
          Body: jpg,
          ACL: "public-read",
          ContentType: "image/jpeg",
        })
      ),
    ]);

    console.log(
      "Stored image",
      cacheKey,
      `(png ${(png.length / 1024 / 1024).toPrecision(2)} mb, jpg ${(
        jpg.length /
        1024 /
        1024
      ).toPrecision(2)} mb)`
    );
  } finally {
    await page.close();
  }
};

export const closeBrowser = async () => {
  if (browser) {
    await (await browser).close();
    browser = null;
  }
};

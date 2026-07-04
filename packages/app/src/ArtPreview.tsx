import classNames from "classnames";
import {
  DetailedHTMLProps,
  IframeHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { useContractRead } from "wagmi";

import { contracts } from "./contracts";
import { previewImageUrl } from "./imageUrls";

const ArtIframe = ({
  tokenId,
  hidden,
  ...props
}: { tokenId: number } & DetailedHTMLProps<
  IframeHTMLAttributes<HTMLIFrameElement>,
  HTMLIFrameElement
>) => {
  const html = useContractRead({
    ...contracts.AFDRenderer,
    functionName: "fullscreenHtml",
    args: [BigInt(tokenId)],
    enabled: !hidden,
  });

  // TODO: show message if token is not found?
  if (!html.isSuccess) return null;
  return <iframe srcDoc={html.data} hidden={hidden} {...props} />;
};

type Props = {
  tokenId: number;
  seed: number;
  disablePointerEvents?: boolean;
  useImage?: boolean;
};

export const ArtPreview = ({
  tokenId,
  seed,
  disablePointerEvents,
  useImage,
}: Props) => {
  const containerRef = useRef<HTMLIFrameElement>(null);
  const [shown, setShown] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const imageUrl = previewImageUrl(tokenId, seed);
  const [hasImage, setHasImage] = useState<boolean | null>(null);

  useEffect(() => {
    if (shown) return;

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShown(entry.isIntersecting);
        });
      },
      { rootMargin: "-20%" }
    );

    observer.observe(element);
    return () => {
      observer.unobserve(element);
    };
  }, [shown]);

  useEffect(() => {
    if (!useImage) return;
    if (!shown) return;
    let mounted = true;
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => mounted && setHasImage(true);
    image.onerror = () => mounted && setHasImage(false);
    return () => {
      mounted = false;
    };
  }, [imageUrl, shown, useImage]);

  if (useImage) {
    return (
      <div ref={containerRef} className="w-full h-full bg-stone-900">
        {hasImage == null || hasImage === true ? (
          <img
            src={hasImage ? imageUrl : undefined}
            className={classNames(
              `w-full h-full transition duration-[3s]`,
              hasImage ? "opacity-100" : "opacity-0",
              disablePointerEvents ? "pointer-events-none" : null
            )}
          />
        ) : (
          <ArtIframe
            tokenId={tokenId}
            hidden={!shown}
            onLoad={() => setLoaded(true)}
            className={classNames(
              `w-full h-full transition duration-[3s]`,
              loaded ? "opacity-100" : "opacity-0",
              disablePointerEvents ? "pointer-events-none" : null
            )}
          />
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-stone-900">
      <ArtIframe
        tokenId={tokenId}
        hidden={!shown}
        onLoad={() => setLoaded(true)}
        className={classNames(
          `w-full h-full transition duration-[3s]`,
          loaded ? "opacity-100" : "opacity-0",
          disablePointerEvents ? "pointer-events-none" : null
        )}
      />
    </div>
  );
};

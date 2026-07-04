import { ArtPreview } from "./ArtPreview";
import { maxSupply } from "./constants";
import { PendingIcon } from "./icons/PendingIcon";

export type Token = { tokenId: number; seed: number };

type Props = {
  tokens: Token[];
};

export const Gallery = ({ tokens }: Props) => {
  if (!tokens.length)
    return (
      <div className="fixed inset-0 p-[8vw] flex items-center justify-center text-xl">
        <PendingIcon />
      </div>
    );

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-[8vw] p-[8vw]">
      {tokens.map((token) => (
        <a
          key={token.tokenId}
          href={`/art/${token.tokenId}`}
          className="block w-full aspect-[400/550] relative hover:scale-110 transition duration-500 text-stone-500 hover:text-stone-300"
        >
          <ArtPreview
            tokenId={token.tokenId}
            seed={token.seed}
            disablePointerEvents
            useImage
          />
          <span className="absolute bottom-full right-0 text-sm leading-relaxed">
            {token.tokenId}/{maxSupply}
          </span>
        </a>
      ))}
    </div>
  );
};

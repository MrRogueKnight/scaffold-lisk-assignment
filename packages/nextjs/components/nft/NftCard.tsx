import Image from "next/image";

interface NftCardProps {
  imageUrl: string;
  name: string;
  description: string;
  isMinting?: boolean;
  onMint?: () => void;
  balance?: number;
}

export const NftCard = ({ imageUrl, name, description, isMinting = false, onMint, balance = 0 }: NftCardProps) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure className="px-10 pt-10">
        <div className="relative w-64 h-64">
          <Image src={imageUrl} alt={`${name} NFT`} fill className="rounded-xl object-contain" priority />
        </div>
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{name}</h2>
        <p className="text-base-content/70">{description}</p>
        <div className="card-actions mt-4">
          <div className="stats bg-base-200">
            <div className="stat">
              <div className="stat-title">Your Balance</div>
              <div className="stat-value text-primary">{balance}</div>
            </div>
          </div>
        </div>
        <button
          className={`btn btn-primary mt-4 w-full ${isMinting ? "loading" : ""}`}
          onClick={onMint}
          disabled={isMinting || balance > 0}
        >
          {balance > 0 ? "Already Minted" : isMinting ? "Minting..." : "Mint NFT"}
        </button>
      </div>
    </div>
  );
};

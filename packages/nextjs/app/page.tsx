"use client";

import { ContractUI } from "./debug/_components/contract/ContractUI";
import type { NextPage } from "next";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { Logo } from "~~/components/Logo";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth/useScaffoldContractRead";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth/useScaffoldContractWrite";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { targetNetwork } = useTargetNetwork();
  const { data: deployedContractData, isLoading: deployedLoading } = useDeployedContractInfo("YourContract");

  const { writeAsync: mintNFT, isMining } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "mintNFT",
  });

  const { data: balanceOfYou } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "balanceOf",
    args: [connectedAddress],
    // Only try reading when connected and contract deployed
    enabled: Boolean(connectedAddress && deployedContractData),
  });

  return (
    <section className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 flex flex-col gap-2 items-center">
        <h1 className="text-center">
          <span className="block text-base mb-2">Welcome to</span>
          <span className="flex items-end gap-4 text-5xl font-bold">
            <Logo size={48} /> Scaffold-Lisk{" "}
          </span>
        </h1>
        <div className="flex btn btn-md bg-base-100 w-fit justify-center mb-4 items-center space-x-2">
          <p className="my-2 font-medium">Connected Address:</p>
          <Address address={connectedAddress} />
        </div>
        {/* Network status */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge ${chain?.id === targetNetwork.id ? "badge-success" : "badge-warning"}`}>
            {chain?.id === targetNetwork.id ? `Connected to ${chain?.name}` : `Wrong network: ${chain?.name || "N/A"}`}
          </span>
          {chain?.id !== targetNetwork.id && (
            <button className="btn btn-sm" onClick={() => switchNetwork?.(targetNetwork.id)}>
              {`Switch to ${targetNetwork.name}`}
            </button>
          )}
        </div>
        {deployedContractData && (
          <div className="mt-1">
            <span className="badge badge-info">YourContract at {deployedContractData.address}</span>
          </div>
        )}
      </div>

      {/* Contract Deployment Guidance */}
      {!deployedLoading && !deployedContractData && (
        <div className="w-full max-w-2xl mx-auto mt-6">
          <div className="rounded-xl border border-warning/60 bg-base-200/80 p-4">
            <h3 className="font-bold text-base-content">No contract found on Hardhat</h3>
            <div className="text-sm text-base-content">
              Make sure your local blockchain is running and the contract is deployed:
              <pre className="mt-2 p-2 bg-base-300 rounded text-base-content">yarn chain</pre>
              <pre className="mt-2 p-2 bg-base-300 rounded text-base-content">yarn deploy --network hardhat</pre>
              Then reload this page.
            </div>
          </div>
        </div>
      )}

      {/* Contract Interaction Panel */}
      {deployedContractData && (
        <div className="w-full max-w-2xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-4">Interact with YourContract</h2>
          <div className="mb-4 flex gap-2">
            <button className="btn btn-primary" onClick={() => mintNFT()} disabled={isMining}>
              {isMining ? "Minting..." : "Mint NFT"}
            </button>
          </div>
          {/* You can reuse this on any page! */}
          {/* If you rename your contract, update the contractName below */}
          <ContractUI contractName="YourContract" />
        </div>
      )}

      {/* Simple balance display */}
      {deployedContractData && (
        <div className="w-full max-w-2xl mx-auto mt-6">
          <div className="bg-base-100 rounded-xl p-4 border border-base-300">
            <div className="text-sm">
              <span className="font-medium">Your NFT balance:</span> {balanceOfYou ? String(balanceOfYou) : "0"}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;

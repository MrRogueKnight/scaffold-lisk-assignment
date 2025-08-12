"use client";

import { useEffect } from "react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export default function MinimalPage() {
  // Get total minted count from the contract
  const { data: totalMinted } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "totalCounter",
  });

  useEffect(() => {
    console.log("Minimal page mounted");

    // Log the total minted value
    console.log("Total minted from contract:", totalMinted?.toString() || "Loading...");

    // Add error handler for any other potential errors
    const errorHandler = (event: ErrorEvent) => {
      console.error("Global error caught:", event);
    };

    window.addEventListener("error", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, [totalMinted]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Minimal Test Page</h1>
      <p className="mb-4">Check the browser console for debug information about the contract state.</p>

      <div className="mt-8 p-4 bg-base-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Contract Information</h2>
        <p>This page displays the current state of the NFT contract.</p>
        <p className="mt-2">Total NFTs Minted: {totalMinted !== undefined ? totalMinted.toString() : "Loading..."}</p>
      </div>
    </div>
  );
}

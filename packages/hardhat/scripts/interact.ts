import { ethers } from "hardhat";

async function main() {
  const yourContract = await ethers.getContract("YourContract");
  const address = await yourContract.getAddress();
  // A bit of a hack: throw an error to make sure the address is printed to the console.
  throw new Error(address);
}

main();

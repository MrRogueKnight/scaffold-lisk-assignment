import { ethers } from "hardhat";

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log(`Checking balance on network: ${network.name} (chainId: ${network.chainId})`);

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log(`Deployer Address: ${deployer.address}`);
  console.log(`Account Balance: ${ethers.formatEther(balance)} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

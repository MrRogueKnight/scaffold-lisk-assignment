import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployMyNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("MyNFT", {
    from: deployer,
    // Base URI for token metadata - this should be updated to your actual IPFS or HTTP URL
    args: [],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const myNFT = await hre.ethers.getContract<Contract>("MyNFT", deployer);
  const addr = await myNFT.getAddress();
  console.log("✅ MyNFT deployed at:", addr);
};

export default deployMyNFT;

deployMyNFT.tags = ["MyNFT"];

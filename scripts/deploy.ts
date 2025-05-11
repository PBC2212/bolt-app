import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy AssetTokenFactory
  const AssetTokenFactory = await ethers.getContractFactory("AssetTokenFactory");
  const assetTokenFactory = await AssetTokenFactory.deploy(deployer.address);
  await assetTokenFactory.waitForDeployment();
  console.log("AssetTokenFactory deployed to:", await assetTokenFactory.getAddress());

  // Deploy SwapFacility
  // For testnet we're using a mock price feed address, in production you would use a real Chainlink feed
  const mockPriceFeedAddress = "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"; // BSC Testnet BNB/USD price feed
  const SwapFacility = await ethers.getContractFactory("SwapFacility");
  const swapFacility = await SwapFacility.deploy(deployer.address, mockPriceFeedAddress);
  await swapFacility.waitForDeployment();
  console.log("SwapFacility deployed to:", await swapFacility.getAddress());

  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners(); // Get deployer address

  const admin = deployer.address;
  const priceFeedAddress = deployer.address; // For local test, we use deployer address

  const SwapFacility = await hre.ethers.getContractFactory("SwapFacility");
  const swapFacility = await SwapFacility.deploy(admin, priceFeedAddress);

  await swapFacility.waitForDeployment();

  console.log(`SwapFacility deployed to: ${await swapFacility.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


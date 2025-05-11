const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const SwapFacility = await ethers.getContractFactory("SwapFacility");

  // ✅ Only pass deployer address as constructor arg (admin)
  const swap = await SwapFacility.deploy(deployer.address);
  await swap.waitForDeployment();

  console.log("✅ New SwapFacility deployed to:", await swap.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

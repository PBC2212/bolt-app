const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // ✅ Updated to your intended token and oracle
  const vetTokenAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // VehicleToken (latest deployed)
  const chainlinkOracle = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"; // Vehicle Mock Oracle
  const admin = deployer.address;

  const SwapFacility = await hre.ethers.getContractFactory("SwapFacility");
  const swap = await SwapFacility.deploy(vetTokenAddress, chainlinkOracle, admin);
  await swap.waitForDeployment();

  console.log(`✅ Deployed SwapFacilityVehicle at: ${swap.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

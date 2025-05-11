const hre = require("hardhat");

async function main() {
  const swapFacilityAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // your deployed SwapFacility address

  const SwapFacility = await hre.ethers.getContractAt("SwapFacility", swapFacilityAddress);

  const adminRole = await SwapFacility.ADMIN_ROLE();
  const feePercentage = await SwapFacility.feePercentage();
  const priceFeed = await SwapFacility.priceFeedAddress();

  console.log(`Admin Role Hash: ${adminRole}`);
  console.log(`Fee Percentage: ${feePercentage} basis points`);
  console.log(`Price Feed Address: ${priceFeed}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

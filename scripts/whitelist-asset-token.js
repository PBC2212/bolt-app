const hre = require("hardhat");

async function main() {
  const swapFacilityAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // your SwapFacility address
  const assetTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your AssetToken address

  const SwapFacility = await hre.ethers.getContractAt("SwapFacility", swapFacilityAddress);

  // Whitelist AssetToken
  const tx = await SwapFacility.setTokenWhitelist(assetTokenAddress, true);
  await tx.wait();

  console.log(`AssetToken whitelisted successfully!`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

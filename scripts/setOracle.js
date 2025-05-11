const { ethers } = require("hardhat");

async function main() {
  const swapFacility = await ethers.getContractAt("SwapFacility", "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707");
  const assetTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const mockPriceFeedAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";

  const tx = await swapFacility.setAssetOracle(assetTokenAddress, mockPriceFeedAddress);
  await tx.wait();

  console.log("✅ Oracle linked to AssetToken.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

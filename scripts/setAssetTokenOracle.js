const { ethers } = require("hardhat");

async function main() {
  const assetToken = await ethers.getContractAt(
    "AssetToken",
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  );

  const mockPriceFeedAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

  const tx = await assetToken.setOracle("real_estate", mockPriceFeedAddress);
  await tx.wait();

  console.log("✅ Oracle set in AssetToken for assetType 'real_estate'");
}

main().catch((error) => {
  console.error("❌ Error setting oracle:", error);
  process.exit(1);
});

const { ethers } = require("hardhat");

async function main() {
  const oracle = await ethers.getContractAt(
    "MockPriceFeed",
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707" // ✅ Correct MockPriceFeed address
  );

  // Set price to $500.00 (8 decimals = 500 * 10^8)
  const tx = await oracle.setPrice(50000000000);
  await tx.wait();

  console.log("✅ Oracle price updated to $500.00");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});

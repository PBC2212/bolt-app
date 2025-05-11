const hre = require("hardhat");

async function main() {
  const [admin] = await hre.ethers.getSigners();
  const swapFacilityAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"; // latest SwapFacility

  const tx = await admin.sendTransaction({
    to: swapFacilityAddress,
    value: hre.ethers.parseEther("10") // Send 10 BNB (ETH in localhost)
  });

  await tx.wait();
  console.log("✅ SwapFacility funded with 10 BNB");
}

main().catch((error) => {
  console.error("❌ Error funding SwapFacility:", error);
  process.exitCode = 1;
});

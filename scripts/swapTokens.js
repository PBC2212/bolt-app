const hre = require("hardhat");

async function main() {
  const [admin, user] = await hre.ethers.getSigners();

  const assetTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your deployed AssetToken
  const swapFacilityAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // ✅ Updated SwapFacility

  const SwapFacility = await hre.ethers.getContractFactory("SwapFacility");
  const swap = await SwapFacility.attach(swapFacilityAddress);

  const amountToSwap = hre.ethers.parseUnits("500", 18); // Swap 500 RET

  const tx = await swap.connect(user).swapTokensForBNB(assetTokenAddress, amountToSwap);
  await tx.wait();

  console.log(`✅ Swapped ${amountToSwap} RET for BNB`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


const hre = require("hardhat");

async function main() {
  const swapFacilityAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // your SwapFacility address
  const assetTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your AssetToken address

  const SwapFacility = await hre.ethers.getContractAt("SwapFacility", swapFacilityAddress);
  const AssetToken = await hre.ethers.getContractAt("AssetToken", assetTokenAddress);

  const [deployer] = await hre.ethers.getSigners();
  const balance = await AssetToken.balanceOf(deployer.address);

  console.log(`Your current AssetToken balance: ${hre.ethers.formatUnits(balance, 18)} TTK`);

  const amountToSwap = balance; // ✅ Swap FULL balance

  console.log(`Swapping ${hre.ethers.formatUnits(amountToSwap, 18)} AssetTokens for BNB...`);

  const tx = await SwapFacility.swapTokensForBNB(assetTokenAddress, amountToSwap);
  await tx.wait();

  console.log(`Swap complete! Swapped ${hre.ethers.formatUnits(amountToSwap, 18)} AssetTokens for BNB successfully!`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

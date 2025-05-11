const hre = require("hardhat");

async function main() {
  const [user] = await hre.ethers.getSigners();

  const rbyTokenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const swapFacilityAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

  const RBY = await hre.ethers.getContractAt("AssetToken", rbyTokenAddress);
  const SwapFacility = await hre.ethers.getContractAt("SwapFacility", swapFacilityAddress);

  console.log("👤 User address:", user.address);

  await (await RBY.mint(user.address, hre.ethers.parseUnits("10", 18))).wait();
  console.log("✅ Minted 10 RBY");

  await (await RBY.approve(swapFacilityAddress, hre.ethers.parseUnits("10", 18))).wait();
  console.log("✅ Approved 10 RBY to SwapFacility");

  await (await SwapFacility.swapTokenForBNB(rbyTokenAddress, hre.ethers.parseUnits("10", 18))).wait();
  console.log("✅ Swapped 10 RBY for BNB");

  const finalRBY = await RBY.balanceOf(user.address);
  const finalBNB = await hre.ethers.provider.getBalance(user.address);

  console.log(`🏁 Final RBY: ${hre.ethers.formatUnits(finalRBY, 18)}`);
  console.log(`🏁 Final BNB: ${hre.ethers.formatEther(finalBNB)}`);
}

main().catch((error) => {
  console.error("❌ RBY Swap Test Failed:", error);
  process.exitCode = 1;
});

const hre = require("hardhat");

async function main() {
  const [user] = await hre.ethers.getSigners();

  const retTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const swapFacilityAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

  const RET = await hre.ethers.getContractAt("AssetToken", retTokenAddress);
  const SwapFacility = await hre.ethers.getContractAt("SwapFacility", swapFacilityAddress);

  console.log("👤 User address:", user.address);

  await (await RET.mint(user.address, hre.ethers.parseUnits("10", 18))).wait();
  console.log("✅ Minted 10 RET");

  await (await RET.approve(swapFacilityAddress, hre.ethers.parseUnits("10", 18))).wait();
  console.log("✅ Approved 10 RET to SwapFacility");

  await (await SwapFacility.swapTokenForBNB(retTokenAddress, hre.ethers.parseUnits("10", 18))).wait();
  console.log("✅ Swapped 10 RET for BNB");

  const finalRET = await RET.balanceOf(user.address);
  const finalBNB = await hre.ethers.provider.getBalance(user.address);

  console.log(`🏁 Final RET: ${hre.ethers.formatUnits(finalRET, 18)}`);
  console.log(`🏁 Final BNB: ${hre.ethers.formatEther(finalBNB)}`);
}

main().catch((error) => {
  console.error("❌ RET Swap Test Failed:", error);
  process.exitCode = 1;
});
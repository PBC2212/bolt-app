const hre = require("hardhat");

async function main() {
  const [user] = await hre.ethers.getSigners();

  const vetTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const swapFacilityAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

  const VET = await hre.ethers.getContractAt("AssetToken", vetTokenAddress);
  const SwapFacility = await hre.ethers.getContractAt("SwapFacility", swapFacilityAddress);

  console.log("👤 User address:", user.address);

  await (await VET.mint(user.address, hre.ethers.parseUnits("10", 18))).wait();
  console.log("✅ Minted 10 VET");

  await (await VET.approve(swapFacilityAddress, hre.ethers.parseUnits("10", 18))).wait();
  console.log("✅ Approved 10 VET to SwapFacility");

  await (await SwapFacility.swapTokenForBNB(vetTokenAddress, hre.ethers.parseUnits("10", 18))).wait();
  console.log("✅ Swapped 10 VET for BNB");

  const finalVET = await VET.balanceOf(user.address);
  const finalBNB = await hre.ethers.provider.getBalance(user.address);

  console.log(`🏁 Final VET: ${hre.ethers.formatUnits(finalVET, 18)}`);
  console.log(`🏁 Final BNB: ${hre.ethers.formatEther(finalBNB)}`);
}

main().catch((error) => {
  console.error("❌ VET Swap Test Failed:", error);
  process.exitCode = 1;
});

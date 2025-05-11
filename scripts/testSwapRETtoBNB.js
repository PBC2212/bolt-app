const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [user] = await hre.ethers.getSigners();
  const addresses = JSON.parse(fs.readFileSync("addresses.json", "utf8"));

  const AssetToken = await hre.ethers.getContractFactory("AssetToken");
  const RET = await AssetToken.attach(addresses.RET);

  const SwapFacility = await hre.ethers.getContractFactory("SwapFacility");
  const swap = await SwapFacility.attach(addresses.SwapFacility);

  console.log(`Using RET at ${addresses.RET}`);
  console.log(`Using SwapFacility at ${addresses.SwapFacility}`);

  // Step 1: Mint 1000 RET to user
  await RET.mint(user.address, hre.ethers.parseUnits("1000", 18));
  console.log("✅ Minted 1000 RET to user");

  // Step 2: Approve SwapFacility
  await RET.approve(addresses.SwapFacility, hre.ethers.parseUnits("1000", 18));
  console.log("✅ Approved 1000 RET for SwapFacility");

  // Step 3: Get balances before
  const retBefore = await RET.balanceOf(user.address);
  const bnbBefore = await hre.ethers.provider.getBalance(user.address);

  console.log(`💰 RET Before: ${hre.ethers.formatUnits(retBefore, 18)}`);
  console.log(`💰 BNB Before: ${hre.ethers.formatEther(bnbBefore)}`);

  // Step 4: Perform the swap (100 RET)
  const tx = await swap.swapTokenForBNB(addresses.RET, hre.ethers.parseUnits("100", 18));
  await tx.wait();
  console.log("🔁 Swapped 100 RET for BNB");

  // Step 5: Get balances after
  const retAfter = await RET.balanceOf(user.address);
  const bnbAfter = await hre.ethers.provider.getBalance(user.address);

  console.log(`✅ RET After: ${hre.ethers.formatUnits(retAfter, 18)}`);
  console.log(`✅ BNB After: ${hre.ethers.formatEther(bnbAfter)}`);
}

main().catch((error) => {
  console.error("❌ Swap test failed:", error);
  process.exitCode = 1;
});

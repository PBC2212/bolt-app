const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [user] = await hre.ethers.getSigners();
  const addresses = JSON.parse(fs.readFileSync("addresses.json", "utf8"));

  // ======= CONFIGURATION =======
  const tokenSymbol = "VET";        // Change to: "RET", "VET", or "RBY"
  const swapAmount = "100";         // Amount to swap (as a string, whole tokens)
  // ==============================

  const tokenAddress = addresses[tokenSymbol];
  if (!tokenAddress) throw new Error(`❌ Token ${tokenSymbol} not found in addresses.json`);

  const token = await hre.ethers.getContractAt("IERC20", tokenAddress);
  const swap = await hre.ethers.getContractAt("SwapFacility", addresses.SwapFacility);

  console.log(`\n🎯 Swapping ${swapAmount} ${tokenSymbol} for BNB...`);
  console.log(`🔗 Token Address: ${tokenAddress}`);
  console.log(`🔗 SwapFacility: ${addresses.SwapFacility}\n`);

  // Step 1: Mint 1000 tokens to user
  const AssetToken = await hre.ethers.getContractFactory("AssetToken");
  const tokenWithMint = await AssetToken.attach(tokenAddress);
  await tokenWithMint.mint(user.address, hre.ethers.parseUnits("1000", 18));
  console.log(`✅ Minted 1000 ${tokenSymbol} to user`);

  // Step 2: Approve the SwapFacility
  await token.approve(addresses.SwapFacility, hre.ethers.parseUnits("1000", 18));
  console.log("✅ Approved 1000 tokens");

  // Step 3: Check balances and allowance before swap
  const tokenBefore = await token.balanceOf(user.address);
  const bnbBefore = await hre.ethers.provider.getBalance(user.address);
  const allowanceBefore = await token.allowance(user.address, addresses.SwapFacility);
  const contractTokenBefore = await token.balanceOf(addresses.SwapFacility);

  console.log(`💰 User ${tokenSymbol}: ${hre.ethers.formatUnits(tokenBefore, 18)}`);
  console.log(`💰 User BNB: ${hre.ethers.formatEther(bnbBefore)}`);
  console.log(`🔐 Allowance: ${hre.ethers.formatUnits(allowanceBefore, 18)}`);
  console.log(`🏦 SwapFacility ${tokenSymbol}: ${hre.ethers.formatUnits(contractTokenBefore, 18)}\n`);

  // Step 4: Perform the swap
  const tx = await swap.swapTokenForBNB(tokenAddress, hre.ethers.parseUnits(swapAmount, 18));
  await tx.wait();
  console.log(`🔁 Swapped ${swapAmount} ${tokenSymbol} for BNB\n`);

  // Step 5: Balances after swap
  const tokenAfter = await token.balanceOf(user.address);
  const bnbAfter = await hre.ethers.provider.getBalance(user.address);
  const allowanceAfter = await token.allowance(user.address, addresses.SwapFacility);
  const contractTokenAfter = await token.balanceOf(addresses.SwapFacility);

  console.log(`✅ User ${tokenSymbol} After: ${hre.ethers.formatUnits(tokenAfter, 18)}`);
  console.log(`✅ User BNB After: ${hre.ethers.formatEther(bnbAfter)}`);
  console.log(`🔐 Remaining Allowance: ${hre.ethers.formatUnits(allowanceAfter, 18)}`);
  console.log(`🏦 SwapFacility ${tokenSymbol} Balance: ${hre.ethers.formatUnits(contractTokenAfter, 18)}\n`);
}

main().catch((error) => {
  console.error("❌ Swap failed:", error);
  process.exitCode = 1;
});

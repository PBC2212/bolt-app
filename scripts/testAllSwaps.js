const hre = require("hardhat");
const fs = require("fs");

async function swapToken(symbol, amount) {
  const [user] = await hre.ethers.getSigners();
  const addresses = JSON.parse(fs.readFileSync("addresses.json", "utf8"));
  const tokenAddress = addresses[symbol];
  const swapAddress = addresses.SwapFacility;

  console.log(`\n🎯 Swapping ${amount} ${symbol} for BNB`);
  console.log(`🔗 Token Address: ${tokenAddress}`);
  console.log(`🔗 SwapFacility: ${swapAddress}`);

  // Use AssetToken for all interactions
  const AssetToken = await hre.ethers.getContractFactory("AssetToken");
  const token = await AssetToken.attach(tokenAddress);
  const swap = await hre.ethers.getContractAt("SwapFacility", swapAddress);

  // Mint tokens to user
  await token.mint(user.address, hre.ethers.parseUnits("1000", 18));
  console.log(`✅ Minted 1000 ${symbol}`);

  // Approve tokens to SwapFacility
  await token.approve(swapAddress, hre.ethers.parseUnits("1000", 18));
  console.log(`✅ Approved 1000 ${symbol}`);

  // Get balances before swap
  const tokenBefore = await token.balanceOf(user.address);
  const bnbBefore = await hre.ethers.provider.getBalance(user.address);

  console.log(`💰 ${symbol} Before: ${hre.ethers.formatUnits(tokenBefore, 18)}`);
  console.log(`💰 BNB Before: ${hre.ethers.formatEther(bnbBefore)}`);

  // Swap
  const tx = await swap.swapTokenForBNB(tokenAddress, hre.ethers.parseUnits(amount, 18));
  await tx.wait();
  console.log(`🔁 Swapped ${amount} ${symbol} for BNB`);

  // Get balances after swap
  const tokenAfter = await token.balanceOf(user.address);
  const bnbAfter = await hre.ethers.provider.getBalance(user.address);
  const contractBalance = await token.balanceOf(swapAddress);

  console.log(`✅ ${symbol} After: ${hre.ethers.formatUnits(tokenAfter, 18)}`);
  console.log(`✅ BNB After: ${hre.ethers.formatEther(bnbAfter)}`);
  console.log(`🏦 SwapFacility ${symbol} Balance: ${hre.ethers.formatUnits(contractBalance, 18)}`);
}

async function main() {
  await swapToken("RET", "100");
  await swapToken("VET", "100");
  await swapToken("RBY", "100");
}

main().catch((err) => {
  console.error("❌ Swap failed:", err);
  process.exitCode = 1;
});

const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [admin] = await hre.ethers.getSigners();
  const addresses = JSON.parse(fs.readFileSync("addresses.json", "utf8"));

  const tokenAddress = addresses.RET;
  const swapAddress = addresses.SwapFacility;
  const oracleAddress = addresses.Oracle;

  const AssetToken = await hre.ethers.getContractFactory("AssetToken");
  const RET = await AssetToken.attach(tokenAddress);

  const swap = await hre.ethers.getContractAt("SwapFacility", swapAddress);

  console.log(`\n🏠 Simulating pledge-to-BNB flow for RET...`);
  console.log(`🔗 AssetToken: ${tokenAddress}`);
  console.log(`🔗 SwapFacility: ${swapAddress}`);
  console.log(`🔗 Oracle: ${oracleAddress}`);

  // 1. Pledge asset with admin
  await RET.pledgeAsset(admin.address, "Real Estate");
  console.log("✅ Asset pledged");

  // 2. Approve pledge (mints tokens)
  await RET.approvePledge(admin.address);
  console.log("✅ Pledge approved — tokens minted");

  // 3. Check balance
  const balance = await RET.balanceOf(admin.address);
  console.log(`💰 RET balance after mint: ${hre.ethers.formatUnits(balance, 18)}`);

  // 4. Approve RET to SwapFacility
  await RET.approve(swapAddress, balance);
  console.log(`✅ Approved ${hre.ethers.formatUnits(balance, 18)} RET to SwapFacility`);

  // 5. Swap RET for BNB
  const tx = await swap.swapTokenForBNB(tokenAddress, balance);
  await tx.wait();
  console.log("🔁 Swapped RET for BNB");

  // 6. Final balances
  const bnbFinal = await hre.ethers.provider.getBalance(admin.address);
  console.log(`✅ Final BNB Balance: ${hre.ethers.formatEther(bnbFinal)}`);
}

main().catch((err) => {
  console.error("❌ Pledge and swap failed:", err);
  process.exitCode = 1;
});

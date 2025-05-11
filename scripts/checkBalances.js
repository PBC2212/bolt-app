const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [user] = await hre.ethers.getSigners();
  const addresses = JSON.parse(fs.readFileSync("addresses.json", "utf8"));

  // ✅ Use getContractAt (NOT getContractFactory) for interface-only attachments
  const RET = await hre.ethers.getContractAt("IERC20", addresses.RET);
  const VET = await hre.ethers.getContractAt("IERC20", addresses.VET);
  const RBY = await hre.ethers.getContractAt("IERC20", addresses.RBY);

  const retBal = await RET.balanceOf(user.address);
  const vetBal = await VET.balanceOf(user.address);
  const rbyBal = await RBY.balanceOf(user.address);
  const bnbBal = await hre.ethers.provider.getBalance(user.address);

  console.log(`📊 RET: ${hre.ethers.formatUnits(retBal, 18)} RET`);
  console.log(`📊 VET: ${hre.ethers.formatUnits(vetBal, 18)} VET`);
  console.log(`📊 RBY: ${hre.ethers.formatUnits(rbyBal, 18)} RBY`);
  console.log(`💰 BNB: ${hre.ethers.formatEther(bnbBal)} BNB`);
}

main().catch((error) => {
  console.error("❌ Balance check failed:", error);
  process.exitCode = 1;
});

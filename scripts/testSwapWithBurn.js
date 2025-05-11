const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [user] = await ethers.getSigners();
  const addresses = JSON.parse(fs.readFileSync("./addresses.json").toString());

  const VET = await ethers.getContractAt("AssetToken", addresses.VET);
  const SwapFacility = await ethers.getContractAt("SwapFacility", addresses.SwapFacility);

  const tokenAmount = ethers.parseEther("10");

  // 🔄 Simulate burn by transferring any leftover tokens to SwapFacility before test
  const existing = await VET.balanceOf(user.address);
  if (existing > 0n) {
    console.log(`🧹 Simulating burn by transferring ${existing} to SwapFacility...`);
    await VET.connect(user).transfer(SwapFacility.target, existing);
  }

  console.log("✅ Minting VET...");
  await VET.connect(user).mint(user.address, tokenAmount);

  const beforeSwap = await VET.balanceOf(user.address);
  console.log("💰 Balance before swap:", beforeSwap.toString());

  console.log("✅ Approving SwapFacility to spend VET...");
  await VET.connect(user).approve(SwapFacility.target, tokenAmount);

  console.log("🔁 Swapping VET for BNB...");
  const tx = await SwapFacility.connect(user).swapTokenForBNB(addresses.VET, tokenAmount);
  await tx.wait();

  const afterSwap = await VET.balanceOf(user.address);
  console.log("💰 Balance after swap:", afterSwap.toString());

  const contractBalance = await VET.balanceOf(SwapFacility.target);
  console.log("🏦 VET held in SwapFacility:", contractBalance.toString());

  const bnbReceived = await ethers.provider.getBalance(user.address);
  console.log("🎉 BNB Balance:", ethers.formatEther(bnbReceived));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

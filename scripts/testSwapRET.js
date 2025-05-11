const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [user] = await ethers.getSigners();
  const addresses = JSON.parse(fs.readFileSync("./addresses.json").toString());

  const RET = await ethers.getContractAt("AssetToken", addresses.RET);
  const SwapFacility = await ethers.getContractAt("SwapFacility", addresses.SwapFacility);

  const tokenAmount = ethers.parseEther("10");

  console.log("✅ Minting RET...");
  await RET.connect(user).mint(user.address, tokenAmount);

  console.log("✅ Approving SwapFacility to spend RET...");
  await RET.connect(user).approve(SwapFacility.target, tokenAmount);

  console.log("🔁 Swapping RET for BNB...");
  const tx = await SwapFacility.connect(user).swapTokenForBNB(addresses.RET, tokenAmount);
  await tx.wait();

  const locked = await RET.balanceOf(SwapFacility.target);
  console.log("🏦 RET now locked in SwapFacility:", ethers.formatEther(locked), "tokens");

  const bnb = await ethers.provider.getBalance(user.address);
  console.log("🎉 BNB Balance:", ethers.formatEther(bnb));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

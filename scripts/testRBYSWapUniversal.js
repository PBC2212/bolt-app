const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const filePath = path.resolve(__dirname, "../deployOutput.json");
  const addresses = JSON.parse(fs.readFileSync(filePath, "utf8"));

  console.log("Loaded addresses:", addresses);

  const [owner] = await ethers.getSigners();

  const RBY = await ethers.getContractAt("AssetToken", addresses.RBY);
  const SWAP = await ethers.getContractAt("SwapFacility", addresses.SwapFacility);

  const mintAmount = ethers.parseUnits("1000", 18);
  await (await RBY.mint(owner.address, mintAmount)).wait();
  console.log(`✅ Minted ${mintAmount} RBY to ${owner.address}`);

  await (await RBY.approve(await SWAP.getAddress(), mintAmount)).wait();
  console.log(`✅ Approved ${mintAmount} RBY for SwapFacility`);

  const swapAmount = ethers.parseUnits("100", 18);
  await (await SWAP.swapTokenForBNB(await RBY.getAddress(), swapAmount)).wait();
  console.log(`🔄 Swapped ${swapAmount} RBY for BNB`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

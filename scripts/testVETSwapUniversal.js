const { ethers } = require("hardhat");

// ✅ Load from the correct deployOutput.json in project root
const addresses = require("../deployOutput.json");

// 🔍 Debug: Print loaded addresses
console.log("Loaded addresses:", addresses);

async function main() {
  const [owner] = await ethers.getSigners();

  const VET = await ethers.getContractAt("AssetToken", addresses.VET);
  const SWAP = await ethers.getContractAt("SwapFacility", addresses.SwapFacility);

  const mintAmount = ethers.parseUnits("1000", 18);
  await (await VET.mint(owner.address, mintAmount)).wait();
  console.log(`✅ Minted ${mintAmount} VET to ${owner.address}`);

  await (await VET.approve(await SWAP.getAddress(), mintAmount)).wait();
  console.log(`✅ Approved ${mintAmount} VET for SwapFacility`);

  const swapAmount = ethers.parseUnits("100", 18);
  await (await SWAP.swapTokenForBNB(await VET.getAddress(), swapAmount)).wait();
  console.log(`🔄 Swapped ${swapAmount} VET for BNB`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

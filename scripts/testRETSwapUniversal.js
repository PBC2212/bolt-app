const { ethers } = require("hardhat");
const addresses = require("../deployOutput.json");

console.log("Loaded addresses:", addresses);

async function main() {
  const [owner] = await ethers.getSigners();

  const RET = await ethers.getContractAt("AssetToken", addresses.RET);
  const SWAP = await ethers.getContractAt("SwapFacility", addresses.SwapFacility);

  const mintAmount = ethers.parseUnits("1000", 18);
  await (await RET.mint(owner.address, mintAmount)).wait();
  console.log(`✅ Minted ${mintAmount} RET to ${owner.address}`);

  await (await RET.approve(await SWAP.getAddress(), mintAmount)).wait();
  console.log(`✅ Approved ${mintAmount} RET for SwapFacility`);

  const swapAmount = ethers.parseUnits("100", 18);
  await (await SWAP.swapTokenForBNB(await RET.getAddress(), swapAmount)).wait();
  console.log(`🔄 Swapped ${swapAmount} RET for BNB`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

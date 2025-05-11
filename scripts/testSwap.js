const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const addresses = JSON.parse(fs.readFileSync("addresses.json", "utf8"));

  const fromTokenAddress = addresses.RET;
  const toTokenAddress = addresses.VET;
  const swapAddress = addresses.SwapFacility;

  const AssetToken = await hre.ethers.getContractFactory("AssetToken");
  const fromToken = await AssetToken.attach(fromTokenAddress);

  // Mint 1000 RET tokens to deployer
  await fromToken.mint(deployer.address, 1000);
  console.log("Minted 1000 RET tokens to deployer");

  // Approve SwapFacility to spend deployer's RET
  await fromToken.approve(swapAddress, 1000);
  console.log("Approved SwapFacility to spend RET");

  // Perform the swap from RET → VET
  const SwapFacility = await hre.ethers.getContractFactory("SwapFacility");
  const swap = await SwapFacility.attach(swapAddress);
  await swap.swap(fromTokenAddress, toTokenAddress, 100);
  console.log("Swapped 100 RET for VET");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const hre = require("hardhat");

async function main() {
  const assetTokenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Your deployed AssetToken address

  const AssetToken = await hre.ethers.getContractAt("AssetToken", assetTokenAddress);

  const name = await AssetToken.name();
  const symbol = await AssetToken.symbol();
  const assetType = await AssetToken.assetType();
  const assetDescription = await AssetToken.assetDescription();

  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Asset Type: ${assetType}`);
  console.log(`Asset Description: ${assetDescription}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

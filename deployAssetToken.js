const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const name = "AssetToken";
  const symbol = "AST";
  const admin = deployer.address;
  const assetType = "Real Estate";
  const assetDescription = "Detroit Property";
  const priceFeedAddress = "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7";

  const AssetToken = await hre.ethers.getContractFactory("AssetToken");

  // ✅ Ethers v6: arguments must be in an array
  const assetToken = await AssetToken.deploy(
    [name, symbol, admin, assetType, assetDescription, priceFeedAddress]
  );

  await assetToken.waitForDeployment();
  console.log(`✅ Deployed AssetToken at: ${assetToken.target}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

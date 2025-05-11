const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const name = "VehicleToken";
  const symbol = "VET";
  const assetType = "vehicle";
  const description = "Token backed by pledged vehicle value";

  const AssetToken = await hre.ethers.getContractFactory("AssetToken");
  const token = await AssetToken.deploy(name, symbol, deployer.address, assetType, description);
  await token.waitForDeployment();

  console.log(`✅ Deployed VehicleToken at: ${token.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

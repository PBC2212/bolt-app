const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Define deployment parameters
  const name = "RealEstateToken";
  const symbol = "RET";
  const admin = deployer.address;
  const assetType = "real_estate";
  const assetDescription = "Commercial Building in NY";

  const AssetToken = await hre.ethers.getContractFactory("AssetToken");
  const assetToken = await AssetToken.deploy(
    name,
    symbol,
    admin,
    assetType,
    assetDescription
  );

  await assetToken.waitForDeployment();

  console.log(`✅ Deployed AssetToken at: ${assetToken.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


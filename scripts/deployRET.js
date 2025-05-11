const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  const AssetToken = await ethers.getContractFactory("AssetToken");

  const name = "Real Estate Token";
  const symbol = "RET";
  const admin = deployer.address;
  const assetType = "RealEstate";
  const assetDescription = "Token backed by pledged real estate";

  const ret = await AssetToken.deploy(name, symbol, admin, assetType, assetDescription);
  await ret.waitForDeployment();

  const retAddress = await ret.getAddress();
  console.log("✅ RET deployed to:", retAddress);

  const filePath = "./addresses.json";
  const addresses = JSON.parse(fs.readFileSync(filePath).toString());
  addresses.RET = retAddress;
  fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  const AssetToken = await ethers.getContractFactory("AssetToken");

  const name = "Ruby Token";
  const symbol = "RBY";
  const admin = deployer.address;
  const assetType = "Ruby";
  const assetDescription = "Token backed by the value of pledged ruby gemstones";

  const rby = await AssetToken.deploy(name, symbol, admin, assetType, assetDescription);
  await rby.waitForDeployment();

  const rbyAddress = await rby.getAddress();
  console.log("✅ RBY deployed to:", rbyAddress);

  // ✅ Update addresses.json
  const filePath = "./addresses.json";
  const addresses = JSON.parse(fs.readFileSync(filePath).toString());
  addresses.RBY = rbyAddress;
  fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


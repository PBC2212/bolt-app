const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  const AssetToken = await ethers.getContractFactory("AssetToken");
  const vet = await AssetToken.deploy("Vehicle Token", "VET", deployer.address, "vehicle", "Vehicle-backed asset");

  await vet.waitForDeployment();

  console.log(`✅ VET deployed to: ${vet.target}`);

  const addresses = JSON.parse(fs.readFileSync("addresses.json").toString());
  addresses.VET = vet.target;
  fs.writeFileSync("addresses.json", JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

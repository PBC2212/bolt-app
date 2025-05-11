const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const AssetToken = await hre.ethers.getContractFactory("AssetToken");

  // Deploy VET
  const vet = await AssetToken.deploy(
    "Vehicle Equity Token",
    "VET",
    deployer.address,
    "Vehicle",
    "Tokenized vehicle equity"
  );
  await vet.waitForDeployment();
  const vetAddress = await vet.getAddress();
  console.log("✅ VET deployed to:", vetAddress);

  // Deploy RBY
  const rby = await AssetToken.deploy(
    "Ruby Asset Token",
    "RBY",
    deployer.address,
    "Precious Gem",
    "Tokenized ruby asset"
  );
  await rby.waitForDeployment();
  const rbyAddress = await rby.getAddress();
  console.log("✅ RBY deployed to:", rbyAddress);

  // Load current addresses.json
  const addresses = JSON.parse(fs.readFileSync("addresses.json", "utf8"));

  // Update only VET and RBY
  addresses.VET = vetAddress;
  addresses.RBY = rbyAddress;

  fs.writeFileSync("addresses.json", JSON.stringify(addresses, null, 2));
  console.log("✅ Updated addresses.json with new VET and RBY");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});

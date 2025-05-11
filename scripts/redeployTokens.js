const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const tokens = [
    { symbol: "RET", name: "Real Estate Token", type: "Real Estate" },
    { symbol: "VET", name: "Vehicle Equity Token", type: "Vehicle" },
    { symbol: "RBY", name: "Ruby Gold Token", type: "Gold" }
  ];

  const addresses = JSON.parse(fs.readFileSync("addresses.json", "utf8"));

  for (const token of tokens) {
    const AssetToken = await hre.ethers.getContractFactory("AssetToken");
    const deployed = await AssetToken.deploy(
      token.name,
      token.symbol,
      deployer.address,
      token.type,
      `${token.symbol} asset-backed token`
    );
    await deployed.waitForDeployment();

    const newAddress = await deployed.getAddress();
    addresses[token.symbol] = newAddress;
    console.log(`✅ ${token.symbol} deployed to: ${newAddress}`);
  }

  fs.writeFileSync("addresses.json", JSON.stringify(addresses, null, 2));
  console.log("✅ Updated addresses.json with new token addresses");
}

main().catch((err) => {
  console.error("❌ Redeployment failed:", err);
  process.exitCode = 1;
});

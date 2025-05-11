const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const AssetToken = await hre.ethers.getContractFactory("AssetToken");

  // Define token configurations
  const tokens = [
    {
      name: "Real Estate Token",
      symbol: "RET",
      assetType: "Real Estate",
      assetDescription: "Tokenized ownership of real estate assets"
    },
    {
      name: "Vehicle Equity Token",
      symbol: "VET",
      assetType: "Vehicle",
      assetDescription: "Tokenized vehicle equity ownership"
    },
    {
      name: "Ruby Asset Token",
      symbol: "RBY",
      assetType: "Precious Gem",
      assetDescription: "Tokenized value of ruby gemstones"
    }
  ];

  // Deploy each token
  for (const token of tokens) {
    const assetToken = await AssetToken.deploy(
      token.name,
      token.symbol,
      deployer.address,
      token.assetType,
      token.assetDescription
    );

    await assetToken.waitForDeployment();

    console.log(`${token.symbol} deployed to: ${await assetToken.getAddress()}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


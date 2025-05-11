const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log("Deploying contracts with account:", deployerAddress);

  // ✅ Deploy AssetToken (RET)
  const TokenFactory = await ethers.getContractFactory("AssetToken");
  const token = await TokenFactory.deploy(
    "Real Estate Token",     // name
    "RET",                   // symbol
    deployerAddress,         // admin
    "Real Estate",           // assetType
    "Token for real estate assets" // description
  );
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("RET deployed at:", tokenAddress);

  // ✅ Deploy Mock Oracle (assumes constructor(int256 _initialPrice))
  const OracleFactory = await ethers.getContractFactory("MockPriceFeed");
  const oracle = await OracleFactory.deploy(20n); // <- just one argument
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("Oracle deployed at:", oracleAddress);

  // ✅ Deploy SwapFacility
  const SwapFactory = await ethers.getContractFactory("SwapFacility");
  const swap = await SwapFactory.deploy(tokenAddress, oracleAddress, deployerAddress);
  await swap.waitForDeployment();
  const swapAddress = await swap.getAddress();
  console.log("SwapFacility deployed at:", swapAddress);

  // ✅ Save deployed addresses
  const addresses = {
    RET: tokenAddress,
    Oracle: oracleAddress,
    SwapFacility: swapAddress
  };
  fs.writeFileSync("scripts/deployOutput.json", JSON.stringify(addresses, null, 2));
  console.log("Addresses saved to scripts/deployOutput.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

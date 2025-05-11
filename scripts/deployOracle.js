const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // ✅ Use fully qualified name to resolve HH701
  const Oracle = await ethers.getContractFactory("contracts/MockOracle.sol:MockOracle");

  const oracle = await Oracle.deploy();
  await oracle.waitForDeployment();

  console.log("✅ Oracle deployed to:", await oracle.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

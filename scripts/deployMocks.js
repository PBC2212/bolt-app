const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying mock oracles with account:", deployer.address);

  const MockOracle = await hre.ethers.getContractFactory("contracts/MockOracle.sol:MockOracle");

  // Deploy VET Oracle
  const vetOracleTx = await MockOracle.deploy();
  await vetOracleTx.waitForDeployment();
  await vetOracleTx.setPrice(BigInt(500 * 1e8)); // $5.00
  console.log("✅ VET Oracle deployed to:", vetOracleTx.target);

  // Deploy RBY Oracle
  const rbyOracleTx = await MockOracle.deploy();
  await rbyOracleTx.waitForDeployment();
  await rbyOracleTx.setPrice(BigInt(250 * 1e8)); // $2.50
  console.log("✅ RBY Oracle deployed to:", rbyOracleTx.target);
}

main().catch((error) => {
  console.error("❌ Error during mock oracle deployment:", error);
  process.exitCode = 1;
});

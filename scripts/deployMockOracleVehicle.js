const hre = require("hardhat");

async function main() {
  const MockOracle = await hre.ethers.getContractFactory("MockOracle");
  const oracle = await MockOracle.deploy();
  await oracle.waitForDeployment();

  console.log(`✅ Deployed Vehicle MockOracle at: ${oracle.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

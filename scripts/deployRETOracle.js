const hre = require("hardhat");

async function main() {
  const MockOracle = await hre.ethers.getContractFactory("contracts/MockOracle.sol:MockOracle");

  const retOracle = await MockOracle.deploy();
  await retOracle.waitForDeployment();
  await retOracle.setPrice(BigInt(1000 * 1e8)); // $1000 per RET

  console.log("✅ RET Oracle deployed to:", retOracle.target);
}

main().catch((error) => {
  console.error("❌ Error deploying RET Oracle:", error);
  process.exitCode = 1;
});

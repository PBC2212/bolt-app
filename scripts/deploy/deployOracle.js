const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const Oracle = await ethers.deployContract("contracts/MockOracle.sol:MockOracle"); // 👈 fully qualified name
  await Oracle.waitForDeployment();

  const logPath = path.join(__dirname, `../../logs/deploy-${process.env.TARGET_NETWORK}.json`);
  let logData = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : {};
  logData.Oracle = Oracle.target;

  fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
  console.log("✅ Oracle deployed to:", Oracle.target);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const logPath = path.join(__dirname, `../../logs/deploy-${process.env.TARGET_NETWORK}.json`);
  const logData = JSON.parse(fs.readFileSync(logPath));
  const oracleAddress = logData.Oracle; // 👈 read Oracle from logs

  const Swap = await ethers.deployContract("SwapFacility", [oracleAddress]); // 👈 pass oracle to constructor
  await Swap.waitForDeployment();

  logData.SwapFacility = Swap.target;
  fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
  console.log("✅ SwapFacility deployed to:", Swap.target);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

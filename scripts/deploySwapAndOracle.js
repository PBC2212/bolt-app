const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Use your previously deployed token addresses
  const tokenAddresses = {
    RET: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    VET: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    RBY: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
  };

  // === 1. Deploy Oracle ===
  console.log("Deploying MockOracle...");
  const Oracle = await hre.ethers.getContractFactory("contracts/MockOracle.sol:MockOracle");
  const oracle = await Oracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("✅ MockOracle deployed to:", oracleAddress);

  // Set simulated oracle price: 100 USD (Chainlink format = 100 * 1e8)
  await oracle.setPrice(100 * 1e8);
  console.log("✅ Oracle price set: 100 * 1e8");

  // === 2. Deploy SwapFacility ===
  console.log("Deploying SwapFacility...");
  const SwapFacility = await hre.ethers.getContractFactory("SwapFacility");
  const swap = await SwapFacility.deploy(deployer.address);
  await swap.waitForDeployment();
  const swapAddress = await swap.getAddress();
  console.log("✅ SwapFacility deployed to:", swapAddress);

  // === 3. Whitelist Tokens ===
  console.log("Whitelisting tokens...");
  await swap.addAllowedToken(tokenAddresses.RET);
  await swap.addAllowedToken(tokenAddresses.VET);
  await swap.addAllowedToken(tokenAddresses.RBY);
  console.log("✅ Tokens whitelisted");

  // === 4. Assign Oracle to Each Token ===
  console.log("Setting token oracles...");
  await swap.setTokenOracle(tokenAddresses.RET, oracleAddress);
  await swap.setTokenOracle(tokenAddresses.VET, oracleAddress);
  await swap.setTokenOracle(tokenAddresses.RBY, oracleAddress);
  console.log("✅ Oracle assigned to all tokens");

  // === 5. Save All Contract Addresses to File ===
  const addresses = {
    RET: tokenAddresses.RET,
    VET: tokenAddresses.VET,
    RBY: tokenAddresses.RBY,
    Oracle: oracleAddress,
    SwapFacility: swapAddress
  };

  fs.writeFileSync("addresses.json", JSON.stringify(addresses, null, 2));
  console.log("✅ All addresses saved to addresses.json");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});

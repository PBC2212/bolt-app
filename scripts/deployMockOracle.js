const { ethers } = require("hardhat");

async function main() {
  const MockPriceFeed = await ethers.getContractFactory("MockPriceFeed");
  const mockOracle = await MockPriceFeed.deploy(1000); // Initial price = 1000

  await mockOracle.waitForDeployment(); // ✅ Corrected method for Ethers v6+

  console.log(`✅ Mock Oracle deployed to: ${mockOracle.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

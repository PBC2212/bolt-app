const hre = require("hardhat");

async function main() {
  const MockPriceFeed = await hre.ethers.getContractFactory("MockPriceFeed");

  // Simulate a $2,000,000 asset price with 8 decimals (like Chainlink)
  const initialPrice = 200000000000; // 2,000,000.00 * 1e8

  const mockFeed = await MockPriceFeed.deploy(initialPrice);
  await mockFeed.waitForDeployment();

  console.log(`✅ MockPriceFeed deployed at: ${mockFeed.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

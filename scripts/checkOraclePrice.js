const { ethers } = require("hardhat");

async function main() {
  const oracle = await ethers.getContractAt(
    "MockPriceFeed",
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  );

  const [, price] = await oracle.latestRoundData();
  console.log(`📈 Oracle price:`, price.toString());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

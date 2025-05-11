const { ethers } = require("hardhat");

async function main() {
  const [, user] = await ethers.getSigners();

  const assetToken = await ethers.getContractAt(
    "AssetToken",
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  );

  const rawBalance = await assetToken.balanceOf(user.address);
  const formatted = ethers.formatUnits(rawBalance, 18);

  console.log(`📊 RET Balance of user: ${formatted} RET`);
}

main().catch((error) => {
  console.error("❌ Error checking balance:", error);
  process.exit(1);
});

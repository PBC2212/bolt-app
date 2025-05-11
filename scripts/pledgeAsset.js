const { ethers } = require("hardhat");

async function main() {
  const [admin, user] = await ethers.getSigners();

  const assetToken = await ethers.getContractAt(
    "AssetToken",
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  );

  console.log(`🔄 Pledging asset for user: ${user.address}`);

  const tx = await assetToken.connect(admin).pledgeAsset(user.address, "real_estate");
  await tx.wait();

  console.log(`✅ Pledge recorded for user: ${user.address}`);
}

main().catch((error) => {
  console.error("❌ Error during pledge:", error);
  process.exit(1);
});

const { ethers } = require("hardhat");

async function main() {
  const [admin, user] = await ethers.getSigners();

  const assetToken = await ethers.getContractAt(
    "AssetToken",
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  );

  const tx = await assetToken.connect(admin).approvePledge(user.address);
  await tx.wait();

  console.log(`✅ Pledge approved. Tokens minted to: ${user.address}`);
}

main().catch((error) => {
  console.error("❌ Error approving pledge:", error);
  process.exit(1);
});

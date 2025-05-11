const hre = require("hardhat");

async function main() {
  const [admin, user] = await hre.ethers.getSigners();

  const assetTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your AssetToken
  const swapFacilityAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // ✅ new SwapFacility

  const AssetToken = await hre.ethers.getContractFactory("AssetToken");
  const assetToken = await AssetToken.attach(assetTokenAddress);

  const amount = hre.ethers.parseUnits("1000", 18); // approve 1000 tokens

  const tx = await assetToken.connect(user).approve(swapFacilityAddress, amount);
  await tx.wait();

  console.log(`✅ Approved SwapFacility to spend ${amount} RET tokens`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


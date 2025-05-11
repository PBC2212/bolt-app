const hre = require("hardhat");

async function main() {
  const assetTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your AssetToken address
  const [deployer] = await hre.ethers.getSigners(); // get your wallet

  const AssetToken = await hre.ethers.getContractAt("AssetToken", assetTokenAddress);

  // Pledge asset for yourself
  const assetValue = 1000000; // means $10,000.00 because assetValue is in cents
  const tx1 = await AssetToken.pledgeAsset(deployer.address, assetValue);
  await tx1.wait();
  console.log("Pledge created.");

  // Approve pledge
  const tx2 = await AssetToken.approvePledge(deployer.address);
  await tx2.wait();
  console.log("Pledge approved, tokens minted.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

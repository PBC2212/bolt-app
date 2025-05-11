const hre = require("hardhat");

async function main() {
  const assetTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your AssetToken address
  const swapFacilityAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // your SwapFacility address

  const AssetToken = await hre.ethers.getContractAt("AssetToken", assetTokenAddress);

  const amountToApprove = hre.ethers.parseUnits("100", 18); // Approve 100 AssetTokens (full balance)

  const tx = await AssetToken.approve(swapFacilityAddress, amountToApprove);
  await tx.wait();

  console.log(`Approved ${amountToApprove} AssetTokens for SwapFacility.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

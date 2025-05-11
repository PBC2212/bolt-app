const { ethers } = require("hardhat");

async function main() {
  const assetToken = await ethers.getContractAt(
    "AssetToken",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Replace if your AssetToken address is different
  );

  const assetValue = await assetToken.assetValue();
  console.log(`💵 assetValue (USD cents): ${assetValue.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

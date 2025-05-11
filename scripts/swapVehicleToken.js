const hre = require("hardhat");

async function main() {
  const [user] = await hre.ethers.getSigners();

  // ✅ Correctly deployed VehicleToken & SwapFacilityVehicle addresses
  const VET = await hre.ethers.getContractAt("AssetToken", "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");
  const SWAP = await hre.ethers.getContractAt("SwapFacility", "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707");

  // ✅ Set the oracle for "vehicle" asset type
  const tx = await VET.setOracle("vehicle", "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6");
  await tx.wait();
  console.log("✅ Oracle set.");

  // ✅ Perform the RET -> BNB swap
  const swapTx = await SWAP.swapRETForBNB(hre.ethers.parseUnits("100", 18));
  await swapTx.wait();
  console.log("✅ Swap completed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

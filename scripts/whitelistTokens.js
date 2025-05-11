const hre = require("hardhat");

async function main() {
  const swapFacilityAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  const vetTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const rbyTokenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const retTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const SwapFacility = await hre.ethers.getContractAt("SwapFacility", swapFacilityAddress);

  await (await SwapFacility.addAllowedToken(vetTokenAddress)).wait();
  console.log("✅ VET token whitelisted");

  await (await SwapFacility.addAllowedToken(rbyTokenAddress)).wait();
  console.log("✅ RBY token whitelisted");

  await (await SwapFacility.addAllowedToken(retTokenAddress)).wait();
  console.log("✅ RET token whitelisted");
}

main().catch((error) => {
  console.error("❌ Error whitelisting tokens:", error);
  process.exitCode = 1;
});
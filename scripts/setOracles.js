const hre = require("hardhat");

async function main() {
  const swapFacilityAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  const vetTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const rbyTokenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const retTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const vetOracleAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const rbyOracleAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const retOracleAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

  const SwapFacility = await hre.ethers.getContractAt("SwapFacility", swapFacilityAddress);

  await (await SwapFacility.setTokenOracle(vetTokenAddress, vetOracleAddress)).wait();
  console.log("✅ Linked VET token to VET oracle");

  await (await SwapFacility.setTokenOracle(rbyTokenAddress, rbyOracleAddress)).wait();
  console.log("✅ Linked RBY token to RBY oracle");

  await (await SwapFacility.setTokenOracle(retTokenAddress, retOracleAddress)).wait();
  console.log("✅ Linked RET token to RET oracle");
}

main().catch((error) => {
  console.error("❌ Error linking oracles:", error);
  process.exitCode = 1;
});
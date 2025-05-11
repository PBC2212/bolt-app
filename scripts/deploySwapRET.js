const { ethers } = require("hardhat");

async function main() {
  const retToken = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // ✅ RET Token Address
  const mockOracle = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // ✅ Mock Oracle Address
  const [admin] = await ethers.getSigners();

  const SwapFacility = await ethers.getContractFactory("SwapFacility");
  const swap = await SwapFacility.deploy(retToken, mockOracle, admin.address);
  await swap.waitForDeployment();

  console.log("✅ SwapFacility for RET deployed to:", swap.target);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

const hre = require("hardhat");

async function main() {
  const [admin] = await hre.ethers.getSigners();

  const swapFacilityAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const tokenToWhitelist = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const SwapFacility = await hre.ethers.getContractFactory("SwapFacility");
  const swap = await SwapFacility.attach(swapFacilityAddress);

  const tx = await swap.connect(admin).setTokenWhitelist(tokenToWhitelist, true);
  await tx.wait();

  console.log(`✅ Token whitelisted: ${tokenToWhitelist}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const addresses = JSON.parse(fs.readFileSync("./addresses.json").toString());
  const SwapFacility = await ethers.getContractAt("SwapFacility", addresses.SwapFacility);

  const tokens = [
    { name: "VET", address: addresses.VET },
    { name: "RET", address: addresses.RET },
    { name: "RBY", address: addresses.RBY },
    // Add more tokens here if needed
  ];

  for (const token of tokens) {
    try {
      const erc20 = await ethers.getContractAt("IERC20", token.address);
      const balance = await erc20.balanceOf(SwapFacility.target);
      console.log(`🏦 ${token.name} locked: ${ethers.formatEther(balance)} tokens`);
    } catch (err) {
      console.log(`⚠️  Could not read balance for ${token.name} (${token.address}): ${err.message}`);
    }
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

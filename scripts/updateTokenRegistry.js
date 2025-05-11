const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [admin] = await hre.ethers.getSigners();
  const addresses = JSON.parse(fs.readFileSync("addresses.json", "utf8"));
  const swap = await hre.ethers.getContractAt("SwapFacility", addresses.SwapFacility);

  for (const symbol of ["RET", "VET", "RBY"]) {
    const token = addresses[symbol];

    // Whitelist the token
    await swap.addAllowedToken(token);
    console.log(`✅ Whitelisted ${symbol} (${token})`);

    // Link oracle (same for all in this mock)
    await swap.setTokenOracle(token, addresses.Oracle);
    console.log(`🔗 Linked oracle for ${symbol}`);
  }
}

main().catch((err) => {
  console.error("❌ Failed to update registry:", err);
  process.exitCode = 1;
});

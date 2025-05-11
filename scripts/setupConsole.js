const fs = require("fs");
const addresses = JSON.parse(fs.readFileSync("addresses.json").toString());

const swap = await ethers.getContractAt("SwapFacility", addresses.SwapFacility);
const ret = await ethers.getContractAt("AssetToken", addresses.RET);
const [user] = await ethers.getSigners();

console.log("✅ Setup complete.");

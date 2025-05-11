const hre = require("hardhat");

async function main() {
    const AssetFactory = await hre.ethers.getContractFactory("AssetFactory");
    const assetFactory = await AssetFactory.deploy();

    await assetFactory.waitForDeployment(); // wait for deployment to finish

    console.log(`AssetFactory deployed to: ${assetFactory.target}`); // correct way to print deployed address
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


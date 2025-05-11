import { ethers } from "ethers";

const swapFacilityAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // <-- your deployed SwapFacility address
const swapFacilityAbi = [ 
    "function pledgeAsset(address assetToken, uint256 amount) external",
    "function swapPledgedAsset(address user, address assetToken, uint256 amountIn, uint256 amountOutMin) external",
    "function pledged(address user, address token) view returns (uint256)"
];

let provider;
let signer;
let swapFacility;

document.getElementById('connectWallet').onclick = async () => {
    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        swapFacility = new ethers.Contract(swapFacilityAddress, swapFacilityAbi, signer);

        const address = await signer.getAddress();
        document.getElementById('walletAddress').innerText = `Connected: ${address}`;

        await loadPledgedBalances(address);
    } else {
        alert("MetaMask not installed!");
    }
};

document.getElementById('pledgeAsset').onclick = async () => {
    const tokenAddress = document.getElementById('assetTokenAddress').value;
    const amount = document.getElementById('amount').value;

    const assetToken = new ethers.Contract(tokenAddress, ["function approve(address spender, uint256 amount) public returns (bool)"], signer);

    await assetToken.approve(swapFacilityAddress, ethers.parseUnits(amount, 18));
    const tx = await swapFacility.pledgeAsset(tokenAddress, ethers.parseUnits(amount, 18));
    await tx.wait();

    alert("Pledge successful!");

    const address = await signer.getAddress();
    await loadPledgedBalances(address);
};

document.getElementById('swapPledgedAsset').onclick = async () => {
    const user = document.getElementById('userAddress').value;
    const token = document.getElementById('swapAssetTokenAddress').value;
    const amount = document.getElementById('swapAmount').value;
    const minOut = document.getElementById('amountOutMin').value;

    const tx = await swapFacility.swapPledgedAsset(
        user,
        token,
        ethers.parseUnits(amount, 18),
        ethers.parseUnits(minOut, 18)
    );
    await tx.wait();

    alert("Swap successful!");
};

async function loadPledgedBalances(address) {
    const tokenAddress = document.getElementById('assetTokenAddress').value;
    if (!tokenAddress) {
        document.getElementById('pledgedBalances').innerText = "Enter AssetToken address above to check pledges.";
        return;
    }

    try {
        const pledgedAmount = await swapFacility.pledged(address, tokenAddress);
        const readableAmount = ethers.formatUnits(pledgedAmount, 18);

        document.getElementById('pledgedBalances').innerText = `Pledged Balance: ${readableAmount} tokens`;
    } catch (err) {
        console.error(err);
        document.getElementById('pledgedBalances').innerText = "Error loading pledged balance.";
    }
}

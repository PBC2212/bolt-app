import { useEffect, useState } from 'react';
import { ethers } from 'ethers';  // ✅ Make sure this is imported!

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum); // ✅ fixed line
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      console.log("Connected:", address);
    } catch (err) {
      console.error("Connection error:", err);
      alert("Failed to connect MetaMask.");
    }
  };

  useEffect(() => {
    connectWallet(); // auto connect on load
  }, []);

  return (
    <div>
      <button
        onClick={connectWallet}
        className="p-2 bg-green-600 text-white rounded"
      >
        {walletAddress
          ? `Connected: ${walletAddress.slice(0, 6)}...`
          : 'Connect Wallet'}
      </button>
    </div>
  );
}

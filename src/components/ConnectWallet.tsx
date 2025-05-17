import { useEffect, useState } from 'react';
import { BrowserProvider } from 'ethers'; // ✅ v6 correct import

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask not detected. Please install MetaMask.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum); // ✅ correct for v6
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
    connectWallet(); // auto connect
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

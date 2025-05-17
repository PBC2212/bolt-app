import { useEffect, useState } from 'react';

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState('');

  const checkIfWalletIsConnected = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        console.log("Connected:", accounts[0]);
      }
    } else {
      alert("MetaMask not found. Please install it.");
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        console.log("Connected:", accounts[0]);
      } catch (error) {
        console.error("Connection error:", error);
        alert("MetaMask connection rejected or failed.");
      }
    } else {
      alert("MetaMask not found.");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
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

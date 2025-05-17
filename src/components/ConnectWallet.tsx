import { useState } from 'react';

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        console.log('Connected:', accounts[0]);
      } catch (err) {
        console.error('User rejected connection:', err);
        alert('Connection rejected. Please approve MetaMask.');
      }
    } else {
      alert('MetaMask not found. Please install MetaMask extension.');
    }
  };

  return (
    <div>
      <button onClick={connectWallet} className="p-2 bg-blue-600 text-white rounded">
        {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : 'Connect Wallet'}
      </button>
    </div>
  );
}


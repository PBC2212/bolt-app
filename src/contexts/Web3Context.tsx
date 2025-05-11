import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

interface Web3ContextType {
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isAdmin: boolean;
  isConnected: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  signer: null,
  chainId: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isAdmin: false,
  isConnected: false,
});

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Hardcoded admin address for demo purposes
  // In production, you would check against the contract's admin role
  const ADMIN_ADDRESS = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      // @ts-ignore
      if (window.ethereum) {
        try {
          // @ts-ignore
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const network = await provider.getNetwork();
            setAccount(accounts[0]);
            setProvider(provider);
            setSigner(provider.getSigner());
            setChainId(network.chainId);
            setIsAdmin(accounts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase());
          }
        } catch (error) {
          console.error('Failed to connect to wallet:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Handle account and chain changes
  useEffect(() => {
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsAdmin(accounts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase());
        } else {
          setAccount(null);
          setIsAdmin(false);
        }
      };

      // @ts-ignore
      const handleChainChanged = (_chainId: string) => {
        window.location.reload();
      };

      // @ts-ignore
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      // @ts-ignore
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        // @ts-ignore
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        // @ts-ignore
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window !== 'undefined') {
      try {
        // @ts-ignore
        if (window.ethereum) {
          // @ts-ignore
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          // @ts-ignore
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const network = await provider.getNetwork();
          
          setAccount(accounts[0]);
          setProvider(provider);
          setSigner(provider.getSigner());
          setChainId(network.chainId);
          setIsAdmin(accounts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase());
          
          // BSC Testnet is chainId 97
          if (network.chainId !== 97) {
            toast.warning('Please switch to BSC Testnet');
            try {
              // @ts-ignore
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x61' }], // 0x61 is hexadecimal for 97
              });
            } catch (switchError: any) {
              // This error code means the chain hasn't been added to MetaMask
              if (switchError.code === 4902) {
                try {
                  // @ts-ignore
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: '0x61',
                        chainName: 'Binance Smart Chain Testnet',
                        nativeCurrency: {
                          name: 'BNB',
                          symbol: 'BNB',
                          decimals: 18,
                        },
                        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                        blockExplorerUrls: ['https://testnet.bscscan.com/'],
                      },
                    ],
                  });
                } catch (addError) {
                  console.error('Failed to add BSC Testnet:', addError);
                }
              }
            }
          }
        } else {
          toast.error('MetaMask is not installed. Please install MetaMask to use this application.');
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast.error('Failed to connect wallet');
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setIsAdmin(false);
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        chainId,
        connectWallet,
        disconnectWallet,
        isAdmin,
        isConnected: !!account,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
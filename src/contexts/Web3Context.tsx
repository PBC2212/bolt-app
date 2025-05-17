import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers'; // ✅ ethers v6
import { toast } from 'react-toastify';

interface Web3ContextType {
  account: string | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
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
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const ADMIN_ADDRESS = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const _provider = new BrowserProvider(window.ethereum);
          const accounts = await _provider.send('eth_accounts', []);
          if (accounts.length > 0) {
            const signer = await _provider.getSigner();
            const address = await signer.getAddress();
            const network = await _provider.getNetwork();
            setAccount(address);
            setProvider(_provider);
            setSigner(signer);
            setChainId(Number(network.chainId)); // ✅ converted to number
            setIsAdmin(address.toLowerCase() === ADMIN_ADDRESS.toLowerCase());
          }
        } catch (err) {
          console.error('Failed to connect to wallet:', err);
        }
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsAdmin(accounts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase());
        } else {
          setAccount(null);
          setIsAdmin(false);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const _provider = new BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const signer = await _provider.getSigner();
        const address = await signer.getAddress();
        const network = await _provider.getNetwork();

        setAccount(address);
        setProvider(_provider);
        setSigner(signer);
        setChainId(Number(network.chainId)); // ✅ converted to number
        setIsAdmin(address.toLowerCase() === ADMIN_ADDRESS.toLowerCase());

        // ✅ FIXED comparison using Number()
        if (Number(network.chainId) !== 97) {
          toast.warning('Please switch to BSC Testnet');
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x61' }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
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
                      rpcUrls: [
                        'https://data-seed-prebsc-1-s1.binance.org:8545/',
                      ],
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
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast.error('Failed to connect wallet');
      }
    } else {
      toast.error('MetaMask is not installed. Please install MetaMask to use this application.');
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

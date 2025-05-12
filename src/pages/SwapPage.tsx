import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { toast } from 'react-toastify';
import { ArrowRightLeft, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import AssetTokenFactoryABI from '../abi/AssetTokenFactory.json';
import AssetTokenABI from '../abi/AssetToken.json';
import SwapFacilityABI from '../abi/SwapFacility.json';

const FACTORY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with actual deployed address
const SWAP_FACILITY_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Replace with actual deployed address

interface TokenOption {
  address: string;
  name: string;
  symbol: string;
  balance: string;
}

const SwapPage: React.FC = () => {
  const { account, provider, signer, isConnected } = useWeb3();
  
  const [tokens, setTokens] = useState<TokenOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [swapping, setSwapping] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [estimatedBNB, setEstimatedBNB] = useState<string>('0');
  const [bnbPrice, setBnbPrice] = useState<string>('300.00'); // Default BNB price
  const [hasFetchedPrice, setHasFetchedPrice] = useState(false);
  
  // Fetch user's tokens
  useEffect(() => {
    const fetchUserTokens = async () => {
      if (isConnected && provider && account) {
        try {
          setLoading(true);
          const factoryContract = new ethers.Contract(
            FACTORY_ADDRESS,
            AssetTokenFactoryABI.abi,
            provider
          );
          
          // Get user's asset tokens
          const tokenAddresses = await factoryContract.getUserAssets(account);
          
          // Fetch details for each token
          const tokenPromises = tokenAddresses.map(async (tokenAddress: string) => {
            const tokenContract = new ethers.Contract(
              tokenAddress,
              AssetTokenABI.abi,
              provider
            );
            
            const name = await tokenContract.name();
            const symbol = await tokenContract.symbol();
            const balance = ethers.utils.formatUnits(await tokenContract.balanceOf(account), 18);
            const status = await tokenContract.pledgeStatus(account);
            
            // Only include approved tokens (status = 1)
            if (status.toString() === '1') {
              return {
                address: tokenAddress,
                name,
                symbol,
                balance
              };
            }
            return null;
          });
          
          const fetchedTokens = (await Promise.all(tokenPromises)).filter(Boolean) as TokenOption[];
          setTokens(fetchedTokens);
          
          // Set default selected token if available
          if (fetchedTokens.length > 0) {
            setSelectedToken(fetchedTokens[0].address);
          }
          
        } catch (error) {
          console.error('Error fetching user tokens:', error);
          toast.error('Failed to load your tokens');
        } finally {
          setLoading(false);
        }
      } else {
        setTokens([]);
        setLoading(false);
      }
    };
    
    fetchUserTokens();
  }, [account, provider, isConnected]);
  
  // Fetch BNB price
  useEffect(() => {
    const fetchBNBPrice = async () => {
      if (provider && !hasFetchedPrice) {
        try {
          const swapContract = new ethers.Contract(
            SWAP_FACILITY_ADDRESS,
            SwapFacilityABI.abi,
            provider
          );
          
          const price = await swapContract.getBNBPrice();
          const formattedPrice = ethers.utils.formatUnits(price, 8);
          setBnbPrice(formattedPrice);
          setHasFetchedPrice(true);
        } catch (error) {
          console.error('Error fetching BNB price:', error);
          // Use default price if fetch fails
        }
      }
    };
    
    fetchBNBPrice();
  }, [provider, hasFetchedPrice]);
  
  // Calculate estimated BNB when amount or token changes
  useEffect(() => {
    const calculateEstimatedBNB = async () => {
      if (provider && selectedToken && amount && parseFloat(amount) > 0) {
        try {
          const swapContract = new ethers.Contract(
            SWAP_FACILITY_ADDRESS,
            SwapFacilityABI.abi,
            provider
          );
          
          const amountInWei = ethers.utils.parseEther(amount);
          const bnbAmount = await swapContract.calculateBNBAmount(selectedToken, amountInWei);
          setEstimatedBNB(ethers.utils.formatEther(bnbAmount));
        } catch (error) {
          console.error('Error calculating BNB amount:', error);
          setEstimatedBNB('0');
        }
      } else {
        setEstimatedBNB('0');
      }
    };
    
    calculateEstimatedBNB();
  }, [provider, selectedToken, amount]);
  
  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(e.target.value);
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || !isNaN(parseFloat(value))) {
      setAmount(value);
    }
  };
  
  const handleMaxClick = () => {
    if (selectedToken) {
      const token = tokens.find(t => t.address === selectedToken);
      if (token) {
        setAmount(token.balance);
      }
    }
  };
  
  const handleSwap = async () => {
    if (!isConnected || !signer) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!selectedToken) {
      toast.error('Please select a token');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    const token = tokens.find(t => t.address === selectedToken);
    if (!token) {
      toast.error('Invalid token selected');
      return;
    }
    
    if (parseFloat(amount) > parseFloat(token.balance)) {
      toast.error('Insufficient token balance');
      return;
    }
    
    try {
      setSwapping(true);
      
      // First approve the swap facility to spend tokens
      const tokenContract = new ethers.Contract(
        selectedToken,
        AssetTokenABI.abi,
        signer
      );
      
      const amountInWei = ethers.utils.parseEther(amount);
      
      const approveTx = await tokenContract.approve(SWAP_FACILITY_ADDRESS, amountInWei);
      await approveTx.wait();
      
      // Then perform the swap
      const swapContract = new ethers.Contract(
        SWAP_FACILITY_ADDRESS,
        SwapFacilityABI.abi,
        signer
      );
      
      const swapTx = await swapContract.swapTokensForBNB(selectedToken, amountInWei);
      await swapTx.wait();
      
      toast.success(`Successfully swapped ${amount} ${token.symbol} for ${estimatedBNB} BNB`);
      
      // Reset form and refresh tokens
      setAmount('');
      
      // Refresh token balances
      const updatedTokens = [...tokens];
      const tokenIndex = updatedTokens.findIndex(t => t.address === selectedToken);
      if (tokenIndex !== -1) {
        const updatedBalance = await tokenContract.balanceOf(account);
        updatedTokens[tokenIndex].balance = ethers.utils.formatUnits(updatedBalance, 18);
        setTokens(updatedTokens);
      }
      
    } catch (error: any) {
      console.error('Error swapping tokens:', error);
      toast.error(error.message || 'Failed to swap tokens');
    } finally {
      setSwapping(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to swap your tokens for BNB.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Tokens for BNB</h1>
          <p className="text-gray-600">
            Convert your asset-backed tokens to BNB at the current market rate.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
        >
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : tokens.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Token
                  </label>
                  <select
                    id="token"
                    value={selectedToken}
                    onChange={handleTokenChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {tokens.map(token => (
                      <option key={token.address} value={token.address}>
                        {token.name} ({token.symbol}) - Balance: {token.balance}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="amount"
                      value={amount}
                      onChange={handleAmountChange}
                      className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.0"
                    />
                    <button
                      type="button"
                      onClick={handleMaxClick}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      MAX
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-center py-4">
                  <ArrowRightLeft className="text-gray-500" size={24} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    You Will Receive
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        {parseFloat(estimatedBNB).toFixed(8)} BNB
                      </span>
                      <span className="text-sm text-gray-500">
                        ≈ ${(parseFloat(estimatedBNB) * parseFloat(bnbPrice)).toFixed(2)} USD
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md flex items-start">
                  <Info className="text-blue-600 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Exchange Rate:</p>
                    <p>1 BNB = ${parseFloat(bnbPrice).toFixed(2)} USD</p>
                    <p>1 Token = $1.00 USD</p>
                    <p className="mt-1 text-xs">A 0.5% swap fee will be applied to the transaction.</p>
                  </div>
                </div>
                
                <button
                  onClick={handleSwap}
                  disabled={swapping || !amount || parseFloat(amount) <= 0}
                  className={`w-full px-4 py-3 flex items-center justify-center text-white font-medium rounded-md ${
                    swapping || !amount || parseFloat(amount) <= 0
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors duration-200`}
                >
                  {swapping ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Swapping...
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="mr-2" size={20} />
                      Swap Tokens for BNB
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tokens Available</h3>
                <p className="text-gray-600 mb-4">
                  You don't have any approved tokenized assets to swap. Please submit assets for tokenization first.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SwapPage;
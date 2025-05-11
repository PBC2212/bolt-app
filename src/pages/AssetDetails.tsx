import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { toast } from 'react-toastify';
import { ArrowLeft, ExternalLink, Copy, Check, Coins, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import AssetTokenABI from '../artifacts/contracts/AssetToken.sol/AssetToken.json';

interface AssetDetails {
  name: string;
  symbol: string;
  assetType: string;
  assetDescription: string;
  assetValue: string;
  status: string;
  balance: string;
  totalSupply: string;
}

const AssetDetails: React.FC = () => {
  const { tokenAddress } = useParams<{ tokenAddress: string }>();
  const { account, provider, isConnected } = useWeb3();
  
  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const fetchAssetDetails = async () => {
      if (isConnected && provider && account && tokenAddress) {
        try {
          setLoading(true);
          
          const tokenContract = new ethers.Contract(
            tokenAddress,
            AssetTokenABI.abi,
            provider
          );
          
          const name = await tokenContract.name();
          const symbol = await tokenContract.symbol();
          const assetType = await tokenContract.assetType();
          const assetDescription = await tokenContract.assetDescription();
          const assetValue = ethers.utils.formatUnits(await tokenContract.assetValue(), 2);
          const balance = ethers.utils.formatUnits(await tokenContract.balanceOf(account), 18);
          const totalSupply = ethers.utils.formatUnits(await tokenContract.totalSupply(), 18);
          const pledgeStatus = await tokenContract.pledgeStatus(account);
          
          // Convert status from number to string
          let status;
          switch (pledgeStatus) {
            case 0:
              status = 'Pending';
              break;
            case 1:
              status = 'Approved';
              break;
            case 2:
              status = 'Rejected';
              break;
            default:
              status = 'Unknown';
          }
          
          setAsset({
            name,
            symbol,
            assetType,
            assetDescription,
            assetValue,
            status,
            balance,
            totalSupply
          });
          
        } catch (error) {
          console.error('Error fetching asset details:', error);
          toast.error('Failed to load asset details');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchAssetDetails();
  }, [account, provider, isConnected, tokenAddress]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy to clipboard');
      }
    );
  };
  
  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to view asset details.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : asset ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{asset.name}</h1>
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-2">
                    {asset.symbol}
                  </span>
                  <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                    asset.status === 'Approved'
                      ? 'bg-green-100 text-green-800'
                      : asset.status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {asset.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center">
                <button
                  onClick={() => window.open(`https://testnet.bscscan.com/token/${tokenAddress}`, '_blank')}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-4"
                >
                  <ExternalLink size={18} className="mr-1" />
                  View on BSCScan
                </button>
                <button
                  onClick={() => tokenAddress && copyToClipboard(tokenAddress)}
                  className="inline-flex items-center text-gray-600 hover:text-gray-800"
                >
                  {copied ? (
                    <>
                      <Check size={18} className="mr-1 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={18} className="mr-1" />
                      Copy Address
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Asset Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Asset Type</p>
                    <p className="text-gray-900">{asset.assetType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Asset Value</p>
                    <p className="text-gray-900">${asset.assetValue} USD</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-gray-900">{asset.assetDescription || 'No description provided'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Token Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Token Balance</p>
                    <p className="text-gray-900">{asset.balance} {asset.symbol}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Supply</p>
                    <p className="text-gray-900">{asset.totalSupply} {asset.symbol}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Token Contract</p>
                    <p className="text-gray-900 text-sm break-all">
                      {tokenAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {asset.status === 'Approved' && (
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to Swap?</h3>
                  <p className="text-gray-600">
                    Convert your {asset.symbol} tokens to BNB at the current market rate.
                  </p>
                </div>
                <Link
                  to="/swap"
                  className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  <Coins className="mr-2" size={18} />
                  Swap Tokens
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Asset Not Found</h2>
          <p className="text-gray-600 mb-6">
            The requested asset could not be found or you don't have access to view it.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Return to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default AssetDetails;
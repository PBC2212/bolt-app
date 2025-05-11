import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { Coins, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import AssetTokenFactoryABI from '../artifacts/contracts/AssetTokenFactory.sol/AssetTokenFactory.json';
import AssetTokenABI from '../artifacts/contracts/AssetToken.sol/AssetToken.json';

interface AssetToken {
  address: string;
  name: string;
  symbol: string;
  balance: string;
  assetType: string;
  assetValue: string;
  status: string;
}

const FACTORY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with actual deployed address

const Dashboard: React.FC = () => {
  const { account, provider, isConnected } = useWeb3();
  const [userAssets, setUserAssets] = useState<AssetToken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAssets = async () => {
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
          const assetPromises = tokenAddresses.map(async (tokenAddress: string) => {
            const tokenContract = new ethers.Contract(
              tokenAddress,
              AssetTokenABI.abi,
              provider
            );
            
            const name = await tokenContract.name();
            const symbol = await tokenContract.symbol();
            const balance = ethers.utils.formatUnits(await tokenContract.balanceOf(account), 18);
            const assetType = await tokenContract.assetType();
            const assetValue = ethers.utils.formatUnits(await tokenContract.assetValue(), 2);
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
            
            return {
              address: tokenAddress,
              name,
              symbol,
              balance,
              assetType,
              assetValue,
              status
            };
          });
          
          const assets = await Promise.all(assetPromises);
          setUserAssets(assets);
        } catch (error) {
          console.error('Error fetching user assets:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUserAssets([]);
        setLoading(false);
      }
    };

    fetchUserAssets();
  }, [account, provider, isConnected]);

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to view your tokenized assets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Assets</h1>
          <p className="text-gray-600">
            View and manage your tokenized real-world assets.
          </p>
        </div>
        <Link
          to="/submit-asset"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          <Coins className="mr-2" size={18} />
          Tokenize New Asset
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : userAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userAssets.map((asset, index) => (
            <motion.div
              key={asset.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
                  <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                    {asset.symbol}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Asset Type:</span> {asset.assetType}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Asset Value:</span> ${asset.assetValue}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Token Balance:</span> {asset.balance}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={`${
                        asset.status === 'Approved'
                          ? 'text-green-600'
                          : asset.status === 'Rejected'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {asset.status}
                    </span>
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/asset/${asset.address}`}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    View Details
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <Link
                  to="/swap"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Swap for BNB
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Coins className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Assets Found</h2>
          <p className="text-gray-600 mb-6">
            You haven't tokenized any assets yet. Get started by submitting your first asset.
          </p>
          <Link
            to="/submit-asset"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <Coins className="mr-2" size={18} />
            Tokenize Your First Asset
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
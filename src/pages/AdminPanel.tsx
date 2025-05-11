import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { toast } from 'react-toastify';
import { Shield, Check, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AssetTokenFactoryABI from '../artifacts/contracts/AssetTokenFactory.sol/AssetTokenFactory.json';
import AssetTokenABI from '../artifacts/contracts/AssetToken.sol/AssetToken.json';

const FACTORY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with actual deployed address

interface PendingAsset {
  tokenAddress: string;
  name: string;
  symbol: string;
  owner: string;
  assetType: string;
  assetValue: string;
  description: string;
}

const AdminPanel: React.FC = () => {
  const { account, provider, signer, isConnected, isAdmin } = useWeb3();
  const navigate = useNavigate();
  
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingAsset, setProcessingAsset] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect if not admin
    if (isConnected && !isAdmin) {
      toast.error('You do not have admin access');
      navigate('/');
    }
    
    const fetchPendingAssets = async () => {
      if (isConnected && provider && isAdmin) {
        try {
          setLoading(true);
          
          const factoryContract = new ethers.Contract(
            FACTORY_ADDRESS,
            AssetTokenFactoryABI.abi,
            provider
          );
          
          // Get total asset tokens count
          const count = await factoryContract.getAssetTokensCount();
          const pending: PendingAsset[] = [];
          
          // Check each token for pending status
          for (let i = 0; i < count; i++) {
            const tokenAddress = await factoryContract.assetTokensList(i);
            const tokenContract = new ethers.Contract(
              tokenAddress,
              AssetTokenABI.abi,
              provider
            );
            
            // Find owner (This is simplified - in a real app, you'd track the owner in the factory)
            // For demo purposes, we'll check events or use a simplified approach
            let owner = '0x0000000000000000000000000000000000000000';
            const filter = tokenContract.filters.AssetPledged();
            const events = await tokenContract.queryFilter(filter);
            if (events.length > 0) {
              owner = events[0].args?.user;
            }
            
            // Check if this asset is pending
            const status = await tokenContract.pledgeStatus(owner);
            
            if (status.toString() === '0') { // 0 = Pending
              const name = await tokenContract.name();
              const symbol = await tokenContract.symbol();
              const assetType = await tokenContract.assetType();
              const assetValue = ethers.utils.formatUnits(await tokenContract.assetValue(), 2);
              const description = await tokenContract.assetDescription();
              
              pending.push({
                tokenAddress,
                name,
                symbol,
                owner,
                assetType,
                assetValue,
                description
              });
            }
          }
          
          setPendingAssets(pending);
        } catch (error) {
          console.error('Error fetching pending assets:', error);
          toast.error('Failed to load pending assets');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPendingAssets();
  }, [isConnected, provider, isAdmin, navigate]);
  
  const handleApprove = async (tokenAddress: string, owner: string) => {
    if (!isConnected || !signer || !isAdmin) {
      toast.error('Admin access required');
      return;
    }
    
    try {
      setProcessingAsset(tokenAddress);
      
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        AssetTokenFactoryABI.abi,
        signer
      );
      
      const tx = await factoryContract.approvePledge(tokenAddress, owner);
      await tx.wait();
      
      toast.success('Asset approved successfully');
      
      // Remove the approved asset from the list
      setPendingAssets(pendingAssets.filter(asset => asset.tokenAddress !== tokenAddress));
    } catch (error: any) {
      console.error('Error approving asset:', error);
      toast.error(error.message || 'Failed to approve asset');
    } finally {
      setProcessingAsset(null);
    }
  };
  
  const handleReject = async (tokenAddress: string, owner: string) => {
    if (!isConnected || !signer || !isAdmin) {
      toast.error('Admin access required');
      return;
    }
    
    try {
      setProcessingAsset(tokenAddress);
      
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        AssetTokenFactoryABI.abi,
        signer
      );
      
      const tx = await factoryContract.rejectPledge(tokenAddress, owner);
      await tx.wait();
      
      toast.success('Asset rejected successfully');
      
      // Remove the rejected asset from the list
      setPendingAssets(pendingAssets.filter(asset => asset.tokenAddress !== tokenAddress));
    } catch (error: any) {
      console.error('Error rejecting asset:', error);
      toast.error(error.message || 'Failed to reject asset');
    } finally {
      setProcessingAsset(null);
    }
  };
  
  if (!isConnected || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Review and approve pending asset tokenization requests.
          </p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : pendingAssets.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value (USD)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingAssets.map((asset, index) => (
                  <motion.tr
                    key={asset.tokenAddress}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {asset.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {asset.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{asset.assetType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${asset.assetValue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {`${asset.owner.substring(0, 6)}...${asset.owner.substring(
                          asset.owner.length - 4
                        )}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {asset.description || 'No description provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {processingAsset === asset.tokenAddress ? (
                        <div className="flex justify-end">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleApprove(asset.tokenAddress, asset.owner)}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded-full transition-colors duration-200"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(asset.tokenAddress, asset.owner)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors duration-200"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                          <button
                            onClick={() => window.open(`https://testnet.bscscan.com/address/${asset.tokenAddress}`, '_blank')}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors duration-200"
                            title="View on Explorer"
                          >
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Shield className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Pending Assets</h2>
          <p className="text-gray-600">
            There are no assets waiting for approval at this time.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
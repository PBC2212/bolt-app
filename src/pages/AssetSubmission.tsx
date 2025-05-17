import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Contract, parseUnits } from 'ethers'; // ✅ Correct for ethers v6
import { useWeb3 } from '../contexts/Web3Context';
import { toast } from 'react-toastify';
import { AlertTriangle, Coins, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import AssetTokenFactoryABI from '../abi/AssetTokenFactory.json';

const FACTORY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const assetTypes = [
  'Real Estate', 'Gold', 'Silver', 'Stocks', 'Bonds', 'Commodities', 'Collectibles', 'Other'
];

const AssetSubmission: React.FC = () => {
  const { account, signer, isConnected } = useWeb3();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    assetName: '',
    assetSymbol: '',
    assetType: '',
    assetDescription: '',
    assetValue: '',
    assetDocuments: null as File | null
  });

  const [submitting, setSubmitting] = useState(false);
  const [customAssetType, setCustomAssetType] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, assetDocuments: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !signer) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setSubmitting(true);

      if (!formData.assetName || !formData.assetSymbol || !formData.assetValue) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      const selectedAssetType =
        formData.assetType === 'Other' ? customAssetType : formData.assetType;

      const assetValueInCents = parseUnits(formData.assetValue, 2); // ✅ ethers v6

      const factoryContract = new Contract(
        FACTORY_ADDRESS,
        AssetTokenFactoryABI.abi,
        signer
      );

      const tx = await factoryContract.createAssetToken(
        formData.assetName,
        formData.assetSymbol,
        selectedAssetType,
        formData.assetDescription,
        account,
        assetValueInCents
      );

      await tx.wait();

      toast.success('Asset submitted for tokenization successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error submitting asset:', error);
      toast.error(error.message || 'Failed to submit asset');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to submit an asset for tokenization.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Asset for Tokenization</h1>
          <p className="text-gray-600">
            Provide details about your real-world asset to create its digital token.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-lg p-8 border border-gray-200"
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="assetName" className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Name *
                </label>
                <input
                  type="text"
                  id="assetName"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Downtown Apartment, Gold Bar, AAPL Shares"
                  required
                />
              </div>

              <div>
                <label htmlFor="assetSymbol" className="block text-sm font-medium text-gray-700 mb-1">
                  Token Symbol *
                </label>
                <input
                  type="text"
                  id="assetSymbol"
                  name="assetSymbol"
                  value={formData.assetSymbol}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. APT, GOLD, AAPL"
                  maxLength={5}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum 5 characters (e.g. BTC, ETH, GOLD)
                </p>
              </div>

              <div>
                <label htmlFor="assetType" className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Type *
                </label>
                <select
                  id="assetType"
                  name="assetType"
                  value={formData.assetType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Asset Type</option>
                  {assetTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {formData.assetType === 'Other' && (
                <div>
                  <label htmlFor="customAssetType" className="block text-sm font-medium text-gray-700 mb-1">
                    Specify Asset Type *
                  </label>
                  <input
                    type="text"
                    id="customAssetType"
                    value={customAssetType}
                    onChange={(e) => setCustomAssetType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Antique Furniture"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="assetDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Description
                </label>
                <textarea
                  id="assetDescription"
                  name="assetDescription"
                  value={formData.assetDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide a detailed description of your asset..."
                />
              </div>

              <div>
                <label htmlFor="assetValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Value (USD) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input
                    type="number"
                    id="assetValue"
                    name="assetValue"
                    value={formData.assetValue}
                    onChange={handleChange}
                    min="1"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Each token will represent $1 USD of asset value
                </p>
              </div>

              <div>
                <label htmlFor="assetDocuments" className="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <UploadCloud className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-600 mb-1">Drag and drop files here or click to browse</p>
                    <p className="text-xs text-gray-500 mb-4">
                      Upload proof of ownership, appraisals, or other relevant documents
                    </p>
                    <input
                      id="assetDocuments"
                      name="assetDocuments"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="assetDocuments"
                      className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-100 transition-colors duration-200"
                    >
                      Select Files
                    </label>
                  </div>
                  {formData.assetDocuments && (
                    <div className="mt-4 text-sm text-gray-700">
                      Selected: {formData.assetDocuments.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Note:</span> Submitted assets will require admin approval before tokenization. You will be notified once your asset has been reviewed.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full px-4 py-3 flex items-center justify-center text-white font-medium rounded-md ${
                    submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors duration-200`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Coins className="mr-2" size={20} />
                      Submit Asset for Tokenization
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AssetSubmission;

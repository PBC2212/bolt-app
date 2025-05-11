import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, ArrowRightLeft, Shield, LayoutDashboard, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tokenize Your Real-World Assets on the Blockchain
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Convert physical assets into digital tokens and unlock their value on the Binance Smart Chain.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/submit-asset"
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                <Coins className="mr-2" size={20} />
                Tokenize Assets
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-400 transition-colors duration-200 flex items-center justify-center"
              >
                <LayoutDashboard className="mr-2" size={20} />
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to tokenize real-world assets and trade them on the blockchain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Coins className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tokenize Assets</h3>
              <p className="text-gray-600">
                Submit your real-world assets for verification, and receive tokenized equivalents backed by their value.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ArrowRightLeft className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Swap Tokens</h3>
              <p className="text-gray-600">
                Trade your asset-backed tokens for BNB at the current market rate with minimal fees.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Blockchain</h3>
              <p className="text-gray-600">
                All transactions are secured on the Binance Smart Chain, ensuring transparency and trust.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Asset Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Supported Asset Types</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform supports a variety of real-world assets that can be tokenized.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Real Estate', description: 'Properties, land, and commercial real estate' },
              { name: 'Precious Metals', description: 'Gold, silver, platinum, and other precious metals' },
              { name: 'Stocks & Equities', description: 'Shares of publicly traded companies' },
              { name: 'Bonds', description: 'Government and corporate bonds' },
              { name: 'Commodities', description: 'Agricultural products, oil, and natural resources' },
              { name: 'Collectibles', description: 'Art, collectibles, and other unique assets' }
            ].map((asset, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{asset.name}</h3>
                <p className="text-gray-600">{asset.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Unlock the Value of Your Assets?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Start tokenizing your real-world assets today and join the future of finance.
          </p>
          <Link
            to="/submit-asset"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            Get Started
            <ChevronRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
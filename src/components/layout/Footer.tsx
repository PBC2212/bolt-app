import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <Coins className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">AssetTokenizer</span>
            </Link>
            <p className="mt-3 text-gray-400">
              Tokenizing real-world assets on the Binance Smart Chain.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/submit-asset"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Submit Asset
                </Link>
              </li>
              <li>
                <Link
                  to="/swap"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Swap Tokens
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://testnet.bscscan.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  BSC Testnet Explorer
                </a>
              </li>
              <li>
                <a
                  href="https://pancakeswap.finance/swap?chain=bscTestnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  PancakeSwap Testnet
                </a>
              </li>
              <li>
                <a
                  href="https://docs.binance.org/smart-chain/developer/bep20.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  BEP-20 Token Standard
                </a>
              </li>
              <li>
                <a
                  href="https://faucet.binance.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  BSC Testnet Faucet
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AssetTokenizer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
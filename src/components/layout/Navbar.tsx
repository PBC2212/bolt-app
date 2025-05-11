import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coins, Home, LayoutDashboard, ArrowRightLeft, Shield, Menu, X } from 'lucide-react';
import { useWeb3 } from '../../contexts/Web3Context';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { account, connectWallet, disconnectWallet, isAdmin, isConnected } = useWeb3();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navItems = [
    { to: '/', label: 'Home', icon: <Home size={20} /> },
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/submit-asset', label: 'Submit Asset', icon: <Coins size={20} /> },
    { to: '/swap', label: 'Swap', icon: <ArrowRightLeft size={20} /> },
  ];

  // Add admin panel link if user is admin
  if (isAdmin) {
    navItems.push({ to: '/admin', label: 'Admin Panel', icon: <Shield size={20} /> });
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Coins className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">AssetTokenizer</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.to
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  } transition-colors duration-200`}
                >
                  {item.icon}
                  <span className="ml-1">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={isConnected ? disconnectWallet : connectWallet}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${
                isConnected
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isConnected ? shortenAddress(account as string) : 'Connect Wallet'}
            </button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="sm:hidden"
        >
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-3 py-2 text-base font-medium ${
                  location.pathname === item.to
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                } transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
            <div className="px-4 py-2">
              <button
                onClick={() => {
                  isConnected ? disconnectWallet() : connectWallet();
                  setIsMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200 ${
                  isConnected
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isConnected ? shortenAddress(account as string) : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Web3Provider from './contexts/Web3Context';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AssetSubmission from './pages/AssetSubmission';
import AdminPanel from './pages/AdminPanel';
import SwapPage from './pages/SwapPage';
import AssetDetails from './pages/AssetDetails';

function App() {
  return (
    <Router>
      <Web3Provider>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/submit-asset" element={<AssetSubmission />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/swap" element={<SwapPage />} />
              <Route path="/asset/:tokenAddress" element={<AssetDetails />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Web3Provider>
    </Router>
  );
}

export default App;
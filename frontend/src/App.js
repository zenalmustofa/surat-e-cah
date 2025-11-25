import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AjukanPage from './pages/AjukanPage';
import AdminDashboard from './pages/AdminDashboard';
import CekStatusPage from './pages/CekStatusPage';
import AdminRoute from './components/AdminRoute';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const isActive = (path) => location.pathname === path ? 'nav-item active' : 'nav-item';

  return (
    <nav className="navbar">
      <div className="nav-container">
        
        {/* LOGO (KIRI) */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
           {/* Kotak Putih Kecil */}
           <span style={{ 
              background: 'white', 
              width: '32px', height: '32px', borderRadius: '6px', display: 'inline-block',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
           }}></span>
          Surat-E Cah
        </Link>

        {/* HAMBURGER (HP ONLY) */}
        <div className="mobile-menu-icon" onClick={toggleMenu}>
          {isOpen ? '✖' : '☰'}
        </div>

        {/* SEMUA MENU (KANAN) */}
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
            <Link to="/" className={isActive('/')} onClick={closeMenu}>
              🏠 Ajukan Surat
            </Link>
            <Link to="/cek-status" className={isActive('/cek-status')} onClick={closeMenu}>
              🔍 Cek Status
            </Link>
            <Link to="/login" className={isActive('/login')} onClick={closeMenu}>
              🔐 Admin
            </Link>
        </div>

      </div>
    </nav>
  );
}

// ... Bagian function App() ke bawah TETAP SAMA ...
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<AjukanPage />} />
            <Route path="/cek-status" element={<CekStatusPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
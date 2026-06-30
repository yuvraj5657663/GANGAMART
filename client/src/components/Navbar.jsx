import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    alert('Logged out successfully! 👋');
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-black tracking-wider text-orange-500 hover:text-orange-400 transition duration-300">
              Ganga<span className="text-white">Mart</span> 🛒
            </Link>
          </div>

          {/* NAV LINKS */}
          <div className="flex items-center space-x-6 font-medium text-sm">
            <Link to="/" className="hover:text-orange-400 transition duration-300 py-2">
              Home
            </Link>
            
            <Link to="/cart" className="relative hover:text-orange-400 transition duration-300 py-2 flex items-center gap-1">
              Cart 🛍️
            </Link>

            {/* ADMIN DASHBOARD LINK */}
            <Link to="/admin/dashboard" className="hover:text-orange-400 transition duration-300 py-2 text-slate-400">
              Admin ⚙️
            </Link>

            {/* AUTH BUTTONS */}
            {userInfo ? (
              <div className="flex items-center gap-4">
                <span className="text-orange-300 text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                  👤 {userInfo.name}
                </span>
                <button
                  onClick={logoutHandler}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded transition duration-300 text-xs shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="hover:text-orange-400 transition duration-300">
                  Login
                </Link>
                <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-1.5 rounded transition duration-300 text-xs shadow-md">
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
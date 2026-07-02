import React, { useState, useEffect, useContext } from 'react'; // 🔥 CartContext ke liye useContext add kiya
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext'; // 🔥 CartContext import kiya

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  
  // 🔥 Cart items nikalne ke liye aur badge count calculate karne ke liye
  const { cartItems } = useContext(CartContext);
  const cartBadgeCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  // 🔥 Static categories list jo Navbar mein link banayegi
  const categories = ['Electronics', 'Clothing', 'Books', 'Shoes'];
  
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.length > 2) {
        try {
          // 🔥 Hardcoded port hata kar clean relative URL kar diya proxy ke liye
          const { data } = await axios.get(`/api/products/search?q=${searchTerm}`);
          setResults(data);
        } catch (error) { 
          console.error("Search fetch error:", error); 
        }
      } else {
        setResults([]);
      }
    };
    fetchResults();
  }, [searchTerm]);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    alert('Logged out successfully! 👋');
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. LOGO */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-black tracking-wider text-orange-500 hover:text-orange-400 transition duration-300">
              Ganga<span className="text-white">Mart</span> 🛒
            </Link>
          </div>

          {/* 🔥 2. CATEGORIES (Desktop Ke Liye Logo ke theek baad) */}
          <div className="hidden lg:flex items-center space-x-4 ml-6">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat}`}
                className="text-xs font-semibold text-slate-300 hover:text-orange-400 transition duration-200 capitalize"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* 3. SEARCH BAR */}
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 text-white px-4 py-1.5 rounded-full text-sm border border-slate-700 focus:outline-none focus:border-orange-500"
            />
            {results.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white text-slate-800 rounded-lg shadow-xl border overflow-hidden z-50">
                {results.map((product) => (
                  <Link 
                    to={`/product/${product._id}`} 
                    key={product._id} 
                    className="block px-4 py-2 hover:bg-orange-50 text-sm border-b last:border-0"
                    onClick={() => { setResults([]); setSearchTerm(''); }}
                  >
                    {product.name} - <span className="font-bold text-orange-600">₹{product.price}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 4. NAV LINKS & AUTH */}
          <div className="flex items-center space-x-6 font-medium text-sm">
            <Link to="/" className="hover:text-orange-400 transition duration-300 py-2">
              Home
            </Link>
            
            {/* 🔥 DYNAMIC CART LINK WITH LIVE BADGE */}
            <Link to="/cart" className="relative hover:text-orange-400 transition duration-300 py-2 flex items-center gap-1 group">
              Cart 🛍️
              {cartBadgeCount > 0 && (
                <span className="absolute -top-1 -right-3 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-black leading-none text-slate-950 bg-orange-500 rounded-full transform scale-90 animate-pulse">
                  {cartBadgeCount}
                </span>
              )}
            </Link>

            {/* ADMIN DASHBOARD LINK */}
            {userInfo && userInfo.isAdmin && (
              <Link to="/admin/dashboard" className="hover:text-orange-400 transition duration-300 py-2 text-slate-400">
                Admin ⚙️
              </Link>
            )}

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
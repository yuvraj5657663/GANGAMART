import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Tailwind Loading Spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Tailwind Error Alert
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-4 bg-rose-50 text-rose-700 rounded-lg border border-rose-200 text-center font-semibold">
        ⚠️ Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO HEADING */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Trending Products 🔥
          </h1>
          <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
            Explore our exclusive collection with top-notch quality and unbeatable prices.
          </p>
        </div>

        {/* PRODUCT GRID LAYOUT */}
        {products.length === 0 ? (
          <div className="text-center text-slate-600 mt-10 font-medium">
            No products found. Add some from the admin panel!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
              >
                {/* Product Image Container */}
                <div className="h-56 bg-slate-100 relative overflow-hidden group">
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {product.category && (
                    <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 line-clamp-1 mb-1">
                      {product.name}
                    </h2>
                    <p className="text-slate-500 text-xs line-clamp-2 mb-4">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    {/* Price & Stock info */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-black text-slate-900">
                        ₹{product.price}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${product.countInStock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={() => addToCart(product)}
                      className="block w-full text-center bg-slate-900 hover:bg-orange-500 text-white font-semibold py-2.5 rounded-lg text-sm transition duration-300 shadow-sm"
                    >
                      Add to Cart 🛒
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const CategoryPage = () => {
  const { categoryName } = useParams(); // URL se category ka naam uthayega
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get(`/api/products/category/${categoryName}`);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen py-10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BACK BUTTON & HEADING */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link to="/" className="text-xs text-slate-400 hover:text-orange-500 transition mb-2 inline-block">
              ⬅️ Back to Home
            </Link>
            <h1 className="text-3xl font-black capitalize tracking-tight">
              Category: <span className="text-orange-500">{categoryName}</span> 🌟
            </h1>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            Found {products.length} products
          </p>
        </div>

        {/* ERROR / NO PRODUCTS FOUND SCREEN */}
        {error ? (
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center max-w-xl mx-auto mt-10">
            <p className="text-slate-400 text-base mb-4">⚠️ {error}</p>
            <Link to="/" className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2 rounded-xl transition text-sm">
              Explore Other Categories
            </Link>
          </div>
        ) : (
          /* PRODUCT GRID LAYOUT */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition duration-300"
              >
                {/* Image Container */}
                <Link to={`/product/${product._id}`} className="h-56 bg-slate-800 relative overflow-hidden group block">
                  <img 
                    src={product.image || 'https://via.placeholder.com/200'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </Link>

                {/* Product Content */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <Link to={`/product/${product._id}`} className="hover:text-orange-400 transition">
                      <h2 className="text-base font-bold line-clamp-1 mb-1">{product.name}</h2>
                    </Link>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-4">{product.description}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-black text-orange-500">₹{product.price}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${product.countInStock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <button 
                      onClick={() => addToCart(product)}
                      disabled={product.countInStock === 0}
                      className={`w-full font-bold py-2 rounded-lg text-xs transition duration-300 ${
                        product.countInStock > 0 
                          ? 'bg-orange-500 hover:bg-orange-600 text-slate-950' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {product.countInStock > 0 ? 'Add to Cart 🛒' : 'Out of Stock'}
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

export default CategoryPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams(); // URL se id nikalne ke liye
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      // 🔥 Yahan se http://localhost:5000 hata kar simple relative URL rakhein
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  fetchProduct();
}, [id]);

  const addToCartHandler = () => {
    // Cart page par le jayenge query params ke sath taaki cart handle ho sake
    navigate(`/cart/${id}?qty=${qty}`);
  };

  if (loading) return <div className="text-center mt-20 text-xl text-white">Loading Product... 🔄</div>;
  if (error) return <div className="text-center mt-20 text-xl text-red-500">Error: {error} ❌</div>;

  return (
    <div className="bg-slate-950 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="inline-block bg-slate-800 text-slate-300 px-4 py-2 rounded mb-6 hover:bg-slate-700 transition">
          ⬅️ Back to Products
        </Link>

        {product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800">
            
            {/* Product Image */}
            <div className="flex items-center justify-center bg-slate-800 rounded-xl overflow-hidden p-4">
              <img 
                src={product.image || "https://via.placeholder.com/400"} 
                alt={product.name} 
                className="max-h-96 object-contain rounded-lg transform hover:scale-105 transition duration-300"
              />
            </div>

            {/* Product Meta / Information */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">
                  {product.category || 'Electronics'}
                </span>
                <h1 className="text-3xl md:text-4xl font-black mt-4 tracking-tight">{product.name}</h1>
                
                <div className="mt-4 flex items-center gap-4 border-b border-slate-800 pb-4">
                  <span className="text-3xl font-extrabold text-orange-500">₹{product.price}</span>
                  <span className={`text-sm px-2.5 py-1 rounded font-semibold ${product.countInStock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Description</h3>
                  <p className="mt-2 text-slate-300 leading-relaxed text-sm">{product.description}</p>
                </div>
              </div>

              {/* Action Box */}
              <div className="mt-8 border-t border-slate-800 pt-6">
                {product.countInStock > 0 && (
                  <div className="flex items-center justify-between mb-4 bg-slate-800/50 p-3 rounded-lg">
                    <span className="text-sm text-slate-400 font-medium">Select Quantity</span>
                    <select 
                      value={qty} 
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="bg-slate-800 text-white border border-slate-700 rounded px-3 py-1 text-sm focus:outline-none focus:border-orange-500"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className={`w-full py-3.5 rounded-xl font-bold tracking-wide transition duration-300 text-sm shadow-lg ${
                    product.countInStock > 0 
                      ? 'bg-orange-500 hover:bg-orange-600 text-slate-950 hover:shadow-orange-500/20' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {product.countInStock > 0 ? '🛍️ Add To Cart' : '❌ Out Of Stock'}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
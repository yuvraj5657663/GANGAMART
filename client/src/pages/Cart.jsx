import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty } = useContext(CartContext);
  const navigate = useNavigate();
  
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-2">
          Your Shopping Cart 🛒
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <h3 className="text-xl font-bold text-slate-700 mb-2">Aapka cart khaali hai! 😮</h3>
            <p className="text-slate-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              to="/" 
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition duration-300 shadow-md"
            >
              Go Shopping 🛍️
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT SIDE: ITEMS LIST */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item._id} 
                  className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition duration-300"
                >
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg bg-slate-100 flex-shrink-0" 
                  />
                  
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-800 text-base line-clamp-1">{item.name}</h4>
                    <p className="text-orange-600 font-bold text-sm mt-0.5">₹{item.price}</p>
                    
                    {/* 🔥 PLUS / MINUS QUANTITY CONTROLS */}
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-slate-500 text-xs font-medium">Quantity:</span>
                      
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        {/* Minus Button */}
                        <button
                          onClick={() => updateQty(item._id, (item.qty || 1) - 1)}
                          disabled={(item.qty || 1) <= 1}
                          className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-600 font-bold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed border-r border-slate-200"
                        >
                          −
                        </button>
                        
                        {/* Quantity Display */}
                        <span className="px-4 py-1 text-slate-800 font-bold text-xs select-none">
                          {item.qty || 1}
                        </span>
                        
                        {/* Plus Button */}
                        <button
                          onClick={() => updateQty(item._id, (item.qty || 1) + 1)}
                          disabled={(item.qty || 1) >= (item.countInStock || 10)}
                          className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-600 font-bold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed border-l border-slate-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Clean Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition duration-300 flex items-center justify-center"
                    title="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE: ORDER SUMMARY */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Order Summary
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Total Items:</span>
                  <span className="font-bold text-slate-800">
                    {cartItems.reduce((acc, item) => acc + (item.qty || 1), 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-slate-900 font-bold">Total Price:</span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/shipping')}
                className="w-full bg-slate-900 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition duration-300 text-center text-sm shadow-md flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <svg xmlns="http://www.w3.org/2000/xl" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
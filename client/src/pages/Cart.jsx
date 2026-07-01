import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  // CartContext se cartItems, addToCart aur removeFromCart nikal rahe hain
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  // Total items calculate karne ke liye
  const totalItems = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  // Total price calculate karne ke liye
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.qty || 1) * item.price, 0);

  const checkoutHandler = () => {
    // Agar user logged in nahi hoga toh login par bhejega, warna shipping par
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=shipping');
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black tracking-tight mb-8">Shopping Cart 🛍️</h1>

        {cartItems.length === 0 ? (
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
            <p className="text-slate-400 text-lg mb-4">Your cart is completely empty!</p>
            <Link to="/" className="inline-block bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition">
              Go Shopping 🛒
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CART ITEMS LIST */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item._id} 
                  className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800 gap-4"
                >
                  {/* Image & Title */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img 
                      src={item.image || "https://via.placeholder.com/80"} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg bg-slate-800"
                    />
                    <div>
                      <Link to={`/product/${item._id}`} className="font-bold text-sm hover:text-orange-400 transition line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-1">Price: <span className="text-orange-500 font-semibold">₹{item.price}</span></p>
                    </div>
                  </div>

                  {/* Quantity & Delete Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                    {/* Qty Selector */}
                    {item.countInStock > 0 && (
                      <select
                        value={item.qty || 1}
                        onChange={(e) => addToCart({ ...item, qty: Number(e.target.value) })}
                        className="bg-slate-800 text-white border border-slate-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-orange-500"
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Total Item Price */}
                    <span className="font-bold text-sm text-slate-200">
                      ₹{(item.qty || 1) * item.price}
                    </span>

                    {/* Delete Button */}
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-slate-500 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-slate-800"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY BOX */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit space-y-6 shadow-xl">
              <h2 className="text-xl font-bold tracking-tight border-b border-slate-800 pb-3">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Total Items:</span>
                  <span className="font-semibold text-white">{totalItems} items</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-3 text-base">
                  <span className="font-bold text-slate-300">Subtotal:</span>
                  <span className="font-black text-orange-500 text-lg">₹{totalPrice}</span>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold py-3 rounded-xl tracking-wide transition duration-300 shadow-lg shadow-orange-500/10 text-sm"
              >
                Proceed To Checkout 🚀
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
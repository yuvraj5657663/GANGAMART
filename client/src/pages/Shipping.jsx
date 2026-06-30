import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Shipping = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // Address fields ki state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

    // 1. Check karein ki user logged in hai ya nahi
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
    if (!userInfo) {
      alert('Please Login first to place an order! 🔐');
      navigate('/login');
      return;
    }

    // Total bill nikalne ke liye
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);

    try {
      // 2. Token ko Authorization header mein bhejna zaroori hai (protect middleware ke liye)
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // 3. Backend par Order request bhejein
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress: { address, city, postalCode, country },
          totalPrice,
        },
        config
      );

      alert('Order Placed Successfully! 🎉📦 Order ID: ' + data._id);
      
      // Order hone ke baad cart khaali karne ke liye localStorage clear kar sakte hain
      localStorage.removeItem('cartItems');
      navigate('/');
      window.location.reload(); // App state reset karne ke liye
      
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed, please try again.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        {/* HEADING */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            Shipping Address 📍
          </h2>
          <p className="text-slate-500 text-xs mt-1">Please enter your delivery details to complete the order.</p>
        </div>
        
        {/* FORM */}
        <form onSubmit={submitHandler} className="space-y-5">
          
          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-1">Address</label>
            <input 
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required 
              placeholder="Flat / House No. / Street Name"
              className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-200"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-1">City</label>
            <input 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              required 
              placeholder="e.g. New Delhi"
              className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-200"
            />
          </div>

          {/* Grid Layout for Postal Code & Country */}
          <div className="grid grid-cols-2 gap-4">
            {/* Postal Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-1">Postal Code</label>
              <input 
                type="text" 
                value={postalCode} 
                onChange={(e) => setPostalCode(e.target.value)} 
                required 
                placeholder="e.g. 110001"
                className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-200"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-1">Country</label>
              <input 
                type="text" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)} 
                required 
                placeholder="India"
                className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-200"
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition duration-300 text-sm shadow-md mt-4 tracking-wide"
          >
            Place Order (Cash on Delivery)
          </button>
        </form>

      </div>
    </div>
  );
};

export default Shipping;
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
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

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
    <div style={{ maxWidth: '500px', margin: '3rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Shipping Address 📍</h2>
      
      <form onSubmit={submitHandler}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>City</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Postal Code</label>
          <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Country</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#e44d26', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Place Order (Cash on Delivery)
        </button>
      </form>
    </div>
  );
};

export default Shipping;
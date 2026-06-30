import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  // Total price calculate karne ke liye
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Your Shopping Cart 🛒</h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h3>Aapka cart khaali hai! 😮</h3>
          <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
            Go Shopping 🛍️
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '2rem' }}>
          
          {/* Left Side: Items List */}
          <div style={{ flex: '2', minWidth: '300px' }}>
            {cartItems.map((item) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #ddd', marginBottom: '10px' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                
                <div style={{ flex: '1', marginLeft: '20px' }}>
                  <h4>{item.name}</h4>
                  <p style={{ color: '#666' }}>Price: ₹{item.price}</p>
                  <p>Quantity: <b>{item.qty}</b></p>
                </div>

                <button 
                  onClick={() => removeFromCart(item._id)}
                  style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Right Side: Order Summary */}
          <div style={{ flex: '1', minWidth: '250px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', height: 'fit-content', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <h3>Order Summary</h3>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
              <span>Total Items:</span>
              <b>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
              <span>Total Price:</span>
              <span style={{ color: '#e44d26', fontWeight: 'bold', fontSize: '18px' }}>
                ₹{totalPrice}
              </span>
            </div>
            <button 
              onClick={() => alert('Checkout functionality comming soon! 🎉')}
              style={{ width: '100%', background: '#007bff', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
            >
              Proceed to Checkout
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
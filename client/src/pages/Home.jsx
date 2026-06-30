import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import  {CartContext}  from '../context/CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Humne proxy set ki hai, isliye direct /api/products likh sakte hain
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

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Products...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center' }}>Error: {error}</h2>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Featured Products 🛒</h1>
      
      {/* Product Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map((product) => (
          <div key={product._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
            <h3 style={{ margin: '10px 0' }}>{product.name}</h3>
            <p style={{ color: '#666', fontSize: '14px', height: '40px', overflow: 'hidden' }}>{product.description}</p>
            <h4 style={{ color: '#e44d26', margin: '10px 0' }}>₹{product.price}</h4>
            <button 
              onClick={() => addToCart(product)} // <-- Yeh onClick add karein
              style={{ background: '#28a745', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
              >
              Add to Cart
              </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
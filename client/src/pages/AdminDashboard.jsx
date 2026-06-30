import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');

  // Products state (for deleting)
  const [products, setProducts] = useState([]);

  // Fetch products for the list
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      await axios.post('/api/products', { name, price, description, image, category, countInStock }, config);
      alert('Product Added Successfully! 🚀📦');
      
      // Fields reset
      setName(''); setPrice(''); setDescription(''); setImage(''); setCategory(''); setCountInStock('');
      fetchProducts(); // List refresh karne ke liye
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product.');
    }
  };

  // 🔥 Delete Handler
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? ⚠️')) {
      const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        };
        await axios.delete(`/api/products/${id}`, config);
        alert('Product Deleted! 🗑️');
        fetchProducts(); // List refresh karein
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      
      {/* LEFT SIDE: FORM */}
      <div style={{ flex: '1', minWidth: '300px', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Add New Product ⚙️</h3>
        <form onSubmit={submitHandler}>
          <div style={{ marginBottom: '0.8rem' }}><label>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '6px', marginTop: '5px' }} /></div>
          <div style={{ marginBottom: '0.8rem' }}><label>Price (₹)</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '100%', padding: '6px', marginTop: '5px' }} /></div>
          <div style={{ marginBottom: '0.8rem' }}><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '6px', marginTop: '5px' }} /></div>
          <div style={{ marginBottom: '0.8rem' }}><label>Image URL</label><input type="text" value={image} onChange={(e) => setImage(e.target.value)} style={{ width: '100%', padding: '6px', marginTop: '5px' }} /></div>
          <div style={{ marginBottom: '0.8rem' }}><label>Category</label><input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%', padding: '6px', marginTop: '5px' }} /></div>
          <div style={{ marginBottom: '1rem' }}><label>Stock</label><input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required style={{ width: '100%', padding: '6px', marginTop: '5px' }} /></div>
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#333', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Publish Product 📢</button>
        </form>
      </div>

      {/* RIGHT SIDE: PRODUCT LIST */}
      <div style={{ flex: '1.2', minWidth: '350px', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Manage Products 🗑️</h3>
        <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Product</th>
                <th style={{ padding: '8px' }}>Price</th>
                <th style={{ padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{prod.name}</td>
                  <td style={{ padding: '8px' }}>₹{prod.price}</td>
                  <td style={{ padding: '8px' }}>
                    <button onClick={() => deleteHandler(prod._id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
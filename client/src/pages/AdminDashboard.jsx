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
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* DASHBOARD HEADER */}
        <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-2">
          Admin Control Center ⚙️
        </h1>

        {/* RESPONSIVE LAYOUT SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* LEFT SIDE: FORM (2 Columns) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 flex items-center gap-2">
              Add New Product 📢
            </h3>
            
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Product Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Sony Headphones" className="w-full bg-slate-50 text-slate-800 text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Price (₹)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="999" className="w-full bg-slate-50 text-slate-800 text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Stock</label>
                  <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required placeholder="10" className="w-full bg-slate-50 text-slate-800 text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="Electronics, Clothing..." className="w-full bg-slate-50 text-slate-800 text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Image URL</label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://unsplash.com/..." className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Write details about the product..." rows="3" className="w-full bg-slate-50 text-slate-800 text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition" />
              </div>

              <button type="submit" className="w-full bg-slate-900 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition duration-300 text-sm shadow-sm tracking-wide">
                Publish Product 🚀
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: MANAGE PRODUCTS (3 Columns) */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-5 border-b border-slate-100 pb-2 flex items-center gap-2">
              Manage Live Products 🗑️
            </h3>
            
            <div className="max-h-[510px] overflow-y-auto rounded-xl border border-slate-100 shadow-inner">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead className="bg-slate-900 text-white sticky top-0 text-xs font-bold tracking-wider uppercase">
                  <tr>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-slate-50/80 transition duration-150">
                      <td className="px-4 py-3.5 font-bold text-slate-800 line-clamp-1 mt-1">{prod.name}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900">₹{prod.price}</td>
                      <td className="px-4 py-3.5 text-center">
                        <button 
                          onClick={() => deleteHandler(prod._id)} 
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-1.5 rounded-lg text-xs transition duration-200 border border-rose-100"
                        >
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
      </div>
    </div>
  );
};

export default AdminDashboard;
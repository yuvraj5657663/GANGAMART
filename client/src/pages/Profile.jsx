import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();

  // User details states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Orders and UI states
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // User token info local storage se nikal rahe hain
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  useEffect(() => {
    // Agar user logged in nahi hai, toh use login page par bhej do
    if (!userInfo) {
      navigate('/login');
      return;
    }

    // Initial form values set kar rahe hain
    setName(userInfo.name || '');
    setEmail(userInfo.email || '');

    // User ke saare orders backend se fetch karne ka function
    const fetchMyOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
        setLoadingOrders(false);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        setLoadingOrders(false);
      }
    };

    fetchMyOrders();
  }, [navigate]);

  // Profile update handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match! ❌');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/users/profile',
        { id: userInfo._id, name, email, password },
        config
      );

      setSuccess(true);
      setMessage('Profile Updated Successfully! 🎉');
      
      // Local storage mein updated user data save kar rahe hain
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: UPDATE PROFILE FORM */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit shadow-xl">
          <h2 className="text-xl font-black tracking-tight mb-2">User Profile 👤</h2>
          <p className="text-xs text-slate-400 mb-6">Update your personal account information.</p>

          {message && (
            <div className={`p-3 rounded-xl text-xs font-semibold text-center mb-4 ${success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {message}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">New Password (Optional)</label>
              <input
                type="password"
                placeholder="Leave blank to keep same"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs tracking-wide transition duration-300 mt-2"
            >
              Update Details ⚙️
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: ORDER HISTORY */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-black tracking-tight mb-2">My Orders 📦</h2>
          <p className="text-xs text-slate-400 mb-6">Track and view history of your placed orders.</p>

          {loadingOrders ? (
            <div className="flex justify-center items-center h-48 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
              <p className="text-slate-400 text-sm">You haven't placed any orders yet!</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">DATE</th>
                    <th className="p-4">TOTAL</th>
                    <th className="p-4">PAID</th>
                    <th className="p-4">DELIVERED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 font-mono text-slate-300 text-[11px]">{order._id}</td>
                      <td className="p-4 text-slate-400">{order.createdAt?.substring(0, 10) || 'N/A'}</td>
                      <td className="p-4 font-bold text-orange-500">₹{order.totalPrice}</td>
                      <td className="p-4">
                        {order.isPaid ? (
                          <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">
                            {order.paidAt?.substring(0, 10)}
                          </span>
                        ) : (
                          <span className="bg-rose-500/10 text-rose-400 font-bold px-2 py-0.5 rounded text-[10px]">❌ No</span>
                        )}
                      </td>
                      <td className="p-4">
                        {order.isDelivered ? (
                          <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">
                            {order.deliveredAt?.substring(0, 10)}
                          </span>
                        ) : (
                          <span className="bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded text-[10px]">🚚 Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
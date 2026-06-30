import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); // URL se reset token read karne ke liye
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match! ❌');
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.put(`/api/auth/reset-password/${token}`, { password });
      setMessage(data.message);
      
      // 3 seconds baad automatic login page par bhej denge
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Token is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Reset Your <span className="text-orange-500">Password</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1.5 font-medium">Please enter your new strong password below.</p>
        </div>

        {message && (
          <div className="mb-5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold px-4 py-3 rounded-xl text-center">
            {message} <span className="block mt-1 text-slate-500 text-[10px]">Redirecting to Login screen...</span>
          </div>
        )}

        {error && (
          <div className="mb-5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}
        
        {!message && (
          <form onSubmit={submitHandler} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-1">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-1">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                placeholder="••••••••"
                className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-200"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition duration-300 text-sm shadow-md tracking-wide disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password 🔐'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;
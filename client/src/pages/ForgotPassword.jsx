import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Backend route ko hit karein
      const { data } = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Forgot <span className="text-orange-500">Password?</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1.5 font-medium">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* SUCCESS ALARM */}
        {message && (
          <div className="mb-5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold px-4 py-3 rounded-xl text-center">
            {message}
          </div>
        )}

        {/* ERROR ALARM */}
        {error && (
          <div className="mb-5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-1">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
              className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-200"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition duration-300 text-sm shadow-md tracking-wide disabled:opacity-50"
          >
            {loading ? 'Sending Link...' : 'Send Reset Link 🚀'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Remember your password?{' '}
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-bold transition duration-200 underline underline-offset-4">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;
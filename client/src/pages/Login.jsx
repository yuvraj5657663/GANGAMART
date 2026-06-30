import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 🔥 Password toggle state
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      alert('Login Successful! 🎉');
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Email or Password');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Ganga<span className="text-orange-500">Mart</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1.5 font-medium">Welcome back! Please sign in to your account.</p>
        </div>

        {error && (
          <div className="mb-5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-xl text-center flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
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

          {/* Password with Eye Icon */}
          <div>
            <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
                className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-200"
              />
              {/* Eye Button Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* 🔥 Forgot Password Link */}
            <div className="text-right mt-2">
              <Link 
                to="/forgot-password" 
                className="text-xs font-semibold text-slate-400 hover:text-orange-500 transition duration-200"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition duration-300 text-sm shadow-md mt-4 tracking-wide"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New Customer?{' '}
          <Link to="/register" className="text-orange-500 hover:text-orange-600 font-bold transition duration-200 underline underline-offset-4">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      // User data aur token ko localStorage mein save karein
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      alert('Login Successful! 🎉');
      navigate('/'); // Login ke baad home page par bhej dein
      window.location.reload(); // Navbar ko update karne ke liye refresh
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Email or Password');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login to GangaMart</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      <form onSubmit={submitHandler}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Sign In
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        New Customer? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
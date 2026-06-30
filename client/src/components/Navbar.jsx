import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // LocalStorage se logged-in user check karein
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    alert('Logged out!');
    window.location.reload();
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#333', color: '#fff' }}>
      <h2>GangaMart</h2>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        <Link to="/cart" style={{ color: '#fff', textDecoration: 'none' }}>Cart</Link>
        
        {userInfo ? (
          <>
            <span style={{ color: '#99ff99' }}>Hello, {userInfo.name}</span>
            <button onClick={logoutHandler} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
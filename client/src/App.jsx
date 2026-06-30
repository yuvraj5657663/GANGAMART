import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />       
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <footer style={{ textAlign: 'center', padding: '1rem', background: '#f1f1f1' }}>
        <p>&copy; 2026 GangaMart. All Rights Reserved.</p>
      </footer>
    </Router>
  );
}

export default App;
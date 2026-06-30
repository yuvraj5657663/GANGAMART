import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Baaki ke routes jaise /login, /cart hum aage add karenge */}
        </Routes>
      </main>
      <footer style={{ textAlign: 'center', padding: '1rem', background: '#f1f1f1' }}>
        <p>&copy; 2026 GangaMart. All Rights Reserved.</p>
      </footer>
    </Router>
  );
}

export default App;
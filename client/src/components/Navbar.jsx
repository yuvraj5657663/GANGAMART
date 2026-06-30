import react from 'react';
import  {Link} from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#333', color: '#fff' }}>
      <h2>GangaMart</h2>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        <Link to="/cart" style={{ color: '#fff', textDecoration: 'none' }}>Cart</Link>
        <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
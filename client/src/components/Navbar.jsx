import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">FitPlanHub</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            {user.role === 'trainer' ? (
              <Link to="/dashboard">Dashboard</Link>
            ) : (
              <Link to="/feed">My Feed</Link>
            )}
            <Link to="/trainers">Trainers</Link>
            <span className="user-info">Hi, {user.name}</span>
            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

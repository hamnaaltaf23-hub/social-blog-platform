import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-primary-lighter transition-colors">Home</Link>
          <Link to="/feed" className="hover:text-primary-lighter transition-colors">Feed</Link>
          <Link to="/friends" className="hover:text-primary-lighter transition-colors">Friends</Link>
          <Link to="/friends/list" className="hover:text-primary-lighter transition-colors">Friends List</Link>
          <Link to="/blog" className="hover:text-primary-lighter transition-colors">Blog</Link>
          <Link to="/profile" className="hover:text-primary-lighter transition-colors">Profile</Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-primary-lighter transition-colors text-yellow-300">Admin</Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span>{user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-primary-lighter hover:bg-primary-light px-3 py-1 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if user has admin role
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/feed" className="hover:text-gray-300">Feed</Link>
          <Link to="/friends" className="hover:text-gray-300">Friends</Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-gray-300 text-yellow-300">Admin</Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span>{user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
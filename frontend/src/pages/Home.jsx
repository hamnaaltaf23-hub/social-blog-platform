import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-primary-light">
          <h1 className="text-2xl font-bold text-primary">Welcome, {user?.name || 'User'}!</h1>
          <p className="text-gray-600">Email: {user?.email}</p>
          <div className="mt-4 space-x-4">
            <Link 
              to="/feed" 
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-light transition-colors"
            >
              Go to Feed
            </Link>
            <Link 
              to="/friends" 
              className="bg-primary-lighter text-white px-4 py-2 rounded hover:bg-primary-light transition-colors"
            >
              Friends
            </Link>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
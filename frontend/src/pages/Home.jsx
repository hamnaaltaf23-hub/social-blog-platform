import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'}!</h1>
          <p className="text-gray-600">Email: {user?.email}</p>
          <div className="mt-4 space-x-4">
            <Link to="/feed" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Go to Feed
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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

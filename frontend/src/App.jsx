import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Friends from './pages/Friends';
import FriendList from './pages/FriendList';
import Admin from './pages/Admin';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Navbar from './components/Navbar';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/feed" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/feed" /> : <Register />} />

      <Route path="/home" element={<ProtectedRoute><><Navbar /><Home /></></ProtectedRoute>} />
      <Route path="/feed" element={<ProtectedRoute><><Navbar /><Feed /></></ProtectedRoute>} />
      <Route path="/friends" element={<ProtectedRoute><><Navbar /><Friends /></></ProtectedRoute>} />
      <Route path="/friends/list" element={<ProtectedRoute><><Navbar /><FriendList /></></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><><Navbar /><Admin /></></ProtectedRoute>} />
      <Route path="/blog" element={<ProtectedRoute><><Navbar /><Blog /></></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><><Navbar /><Profile /></></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><><Navbar /><EditProfile /></></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
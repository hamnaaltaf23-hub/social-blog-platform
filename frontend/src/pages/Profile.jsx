import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/profile/me/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if (res.ok) {
        setProfileUser(data);
        // FIX: Compare data._id with user.id (not user._id)
        if (user && data._id === user.id) {
          setIsOwnProfile(true);
        }
      } else {
        console.error('Error fetching profile:', data.error);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  if (loading) return <div className="p-4 text-gray-600">Loading profile...</div>;
  if (!profileUser) return <div className="p-4 text-red-500">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-300 rounded-t-lg overflow-hidden">
        {profileUser.coverImage ? (
          <img src={profileUser.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#4A5DA6] flex items-center justify-center text-white">
            Cover Image
          </div>
        )}
        {/* Avatar */}
        <div className="absolute -bottom-12 left-4">
          {profileUser.avatar ? (
            <img src={profileUser.avatar} alt={profileUser.name} className="w-24 h-24 rounded-full border-4 border-white object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white bg-[#1E2A5A] flex items-center justify-center text-3xl text-white">
              {profileUser.name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-16 p-4 bg-white rounded-b-lg shadow">
        <h1 className="text-2xl font-bold text-[#1E2A5A]">{profileUser.name}</h1>
        <p className="text-gray-600">{profileUser.email}</p>
        {profileUser.bio && <p className="mt-2 text-gray-700">{profileUser.bio}</p>}
        {profileUser.location && <p className="text-sm text-gray-500">📍 {profileUser.location}</p>}
        {profileUser.website && (
          <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="text-[#4A5DA6] hover:underline">
            {profileUser.website}
          </a>
        )}
        <p className="text-sm text-gray-400 mt-2">Joined: {new Date(profileUser.created_at).toLocaleDateString()}</p>
        
        {isOwnProfile && (
          <div className="mt-4">
            <Link to="/profile/edit" className="bg-[#1E2A5A] text-white px-4 py-2 rounded hover:bg-[#2E3E7A] transition-colors inline-block">
              Edit Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
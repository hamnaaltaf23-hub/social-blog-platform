import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const fetchFriends = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/friends/list', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setFriends(data);
    } catch (err) {
      console.error('Error fetching friends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  if (loading) return <div className="p-4 text-gray-500">Loading friends...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ color: '#1E2A5A' }}>
        My Friends ({friends.length})
      </h1>
      {friends.length === 0 ? (
        <p className="text-gray-500">You haven't added any friends yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {friends.map(friend => (
            <div
              key={friend._id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
              style={{ borderColor: '#2E3E7A' }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: '#4A5DA6' }}>
                  {friend.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: '#1E2A5A' }}>{friend.name}</h3>
                  <p className="text-sm text-gray-500">{friend.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendList;
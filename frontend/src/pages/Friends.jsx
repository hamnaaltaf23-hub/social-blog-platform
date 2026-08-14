import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Friends = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  // Fetch pending friend requests
  const fetchPendingRequests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/friends/pending', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setPendingRequests(data);
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    }
  };

  // Search users by email
  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/search?email=${searchTerm}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  // Send friend request
  const sendRequest = async (toUserId) => {
    try {
      const res = await fetch('http://localhost:5000/api/friends/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ toUserId })
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      // Refresh search results (remove the user from results or mark)
      searchUsers();
      fetchPendingRequests();
    } catch (err) {
      console.error('Send request error:', err);
    }
  };

  // Accept friend request
  const acceptRequest = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/friends/accept/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await res.json();
      setMessage(data.message);
      fetchPendingRequests();
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  // Decline friend request
  const declineRequest = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/friends/decline/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await res.json();
      setMessage(data.message);
      fetchPendingRequests();
    } catch (err) {
      console.error('Decline error:', err);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>

      {message && <p className="text-green-500 mb-2">{message}</p>}

      {/* Search for users */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Find People</h2>
        <div className="flex mt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by email..."
            className="flex-1 border rounded p-2"
          />
          <button
            onClick={searchUsers}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        {searchResults.length > 0 && (
          <ul className="mt-2 border rounded">
            {searchResults.map(u => (
              <li key={u._id} className="flex justify-between items-center p-2 border-b">
                <span>{u.name} ({u.email})</span>
                <button
                  onClick={() => sendRequest(u._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Add Friend
                </button>
              </li>
            ))}
          </ul>
        )}
        {searchResults.length === 0 && searchTerm && <p className="text-gray-500 mt-2">No users found.</p>}
      </div>

      {/* Pending friend requests */}
      <div>
        <h2 className="text-lg font-semibold">Pending Requests</h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500 mt-2">No pending requests.</p>
        ) : (
          <ul className="mt-2 border rounded">
            {pendingRequests.map(req => (
              <li key={req._id} className="flex justify-between items-center p-2 border-b">
                <span>{req.from_user_id?.name} ({req.from_user_id?.email})</span>
                <div>
                  <button
                    onClick={() => acceptRequest(req._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => declineRequest(req._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Friends;
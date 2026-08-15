import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Friends = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  // Fetch pending friend requests
  const fetchPendingRequests = async () => {
    try {
      console.log('Fetching pending requests...');
      const res = await fetch('http://localhost:5000/api/friends/pending', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      console.log('Pending requests:', data);
      setPendingRequests(data);
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    }
  };

  // Search users by email
  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    try {
      console.log('Searching for:', searchTerm);
      const res = await fetch(`http://localhost:5000/api/users/search?email=${searchTerm}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      console.log('Search results:', data);
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  // Send friend request
  const sendRequest = async (toUserId) => {
    try {
      console.log('Sending request to:', toUserId);
      const res = await fetch('http://localhost:5000/api/friends/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ toUserId })
      });
      const data = await res.json();
      console.log('Send request response:', data);
      setMessage(data.message || data.error);
      setMessageType(res.ok ? 'success' : 'error');
      searchUsers();
      fetchPendingRequests();
    } catch (err) {
      console.error('Send request error:', err);
      setMessage('Error sending request');
      setMessageType('error');
    }
  };

  // Accept friend request
  const acceptRequest = async (requestId) => {
    console.log('Accept button clicked for request:', requestId);
    try {
      const res = await fetch(`http://localhost:5000/api/friends/accept/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await res.json();
      console.log('Accept response:', data);
      setMessage(data.message || data.error);
      setMessageType(res.ok ? 'success' : 'error');
      if (res.ok) {
        fetchPendingRequests(); // refresh the list
      }
    } catch (err) {
      console.error('Accept error:', err);
      setMessage('Error accepting request');
      setMessageType('error');
    }
  };

  // Decline friend request
  const declineRequest = async (requestId) => {
    console.log('Decline button clicked for request:', requestId);
    try {
      const res = await fetch(`http://localhost:5000/api/friends/decline/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await res.json();
      console.log('Decline response:', data);
      setMessage(data.message || data.error);
      setMessageType(res.ok ? 'success' : 'error');
      if (res.ok) {
        fetchPendingRequests(); // refresh the list
      }
    } catch (err) {
      console.error('Decline error:', err);
      setMessage('Error declining request');
      setMessageType('error');
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>

      {message && (
        <p className={`mb-2 ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}

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
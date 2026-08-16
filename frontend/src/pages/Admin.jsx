import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/posts', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/comments', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const deletePost = async (postId) => {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const moderateComment = async (commentId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/comments/${commentId}/moderate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchComments();
    } catch (err) {
      console.error('Error moderating comment:', err);
    }
  };

  const deleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchStats();
      await fetchUsers();
      await fetchPosts();
      await fetchComments();
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="p-4">Loading admin dashboard...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      {message && <p className="mb-2 text-green-500">{message}</p>}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-primary text-white p-4 rounded shadow">
          <h3 className="text-lg">Total Users</h3>
          <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow">
          <h3 className="text-lg">Total Posts</h3>
          <p className="text-2xl font-bold">{stats?.totalPosts || 0}</p>
        </div>
        <div className="bg-primary-lighter text-white p-4 rounded shadow">
          <h3 className="text-lg">Total Comments</h3>
          <p className="text-2xl font-bold">{stats?.totalComments || 0}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded shadow">
          <h3 className="text-lg">Pending Moderation</h3>
          <p className="text-2xl font-bold">{stats?.pendingComments || 0}</p>
        </div>
      </div>

      {/* Users Section */}
      <h2 className="text-xl font-bold mb-2">Users</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role || 'user'}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Posts Section */}
      <h2 className="text-xl font-bold mb-2">Posts</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Author</th>
              <th className="p-2 text-left">Content</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p._id} className="border-b">
                <td className="p-2">{p.author_id?.name || 'Unknown'}</td>
                <td className="p-2">{p.content?.substring(0, 50)}...</td>
                <td className="p-2">
                  <button
                    onClick={() => deletePost(p._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comments Section */}
      <h2 className="text-xl font-bold mb-2">Comments</h2>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Content</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map(c => (
              <tr key={c._id} className="border-b">
                <td className="p-2">{c.user_id?.name || 'Unknown'}</td>
                <td className="p-2">{c.content?.substring(0, 50)}...</td>
                <td className="p-2">{c.status || 'approved'}</td>
                <td className="p-2">
                  {c.status === 'flagged' && (
                    <button
                      onClick={() => moderateComment(c._id, 'approved')}
                      className="bg-primary-light text-white px-2 py-1 rounded text-sm hover:bg-green-600 mr-1"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => deleteComment(c._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
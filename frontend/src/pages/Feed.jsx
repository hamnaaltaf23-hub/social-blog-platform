import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts from: http://localhost:5000/api/posts/feed');
      const res = await axios.get('http://localhost:5000/api/posts/feed', {
        headers: { Authorization: Bearer  }
      });
      console.log('Posts fetched:', res.data);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err.response?.data || err.message);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    console.log('Sending POST to: http://localhost:5000/api/posts');
    try {
      const res = await axios.post('http://localhost:5000/api/posts', { content }, {
        headers: { Authorization: Bearer  }
      });
      console.log('Post created successfully:', res.data);
      setContent('');
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feed</h1>
      <form onSubmit={createPost} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border rounded p-2"
          rows="3"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Post</button>
      </form>
      <div>
        {posts.length === 0 && <p className="text-gray-500">No posts yet. Be the first!</p>}
        {posts.map(post => (
          <div key={post._id} className="border rounded p-4 mb-4 shadow">
            <div className="flex items-center mb-2">
              <span className="font-bold">{post.author_id?.name || 'Unknown'}</span>
              <span className="text-sm text-gray-500 ml-2">{new Date(post.created_at).toLocaleString()}</span>
            </div>
            <p>{post.content}</p>
            <div className="flex mt-2">
              <button className="text-blue-500 mr-4">Like ({post.likes?.length || 0})</button>
              <button className="text-gray-500">Comment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;

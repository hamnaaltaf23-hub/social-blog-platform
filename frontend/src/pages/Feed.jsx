import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [commentText, setCommentText] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts/feed', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      console.log('Fetched posts:', data);
      setPosts(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      console.log('Post created:', data);
      setContent('');
      fetchPosts();
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await res.json();
      console.log('Like response:', data);
      fetchPosts();
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ content: commentText[postId] })
      });
      const data = await res.json();
      console.log('Comment added:', data);
      setCommentText({ ...commentText, [postId]: '' });
      setShowCommentInput({ ...showCommentInput, [postId]: false });
      fetchPosts();
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  const toggleCommentInput = (postId) => {
    setShowCommentInput({ 
      ...showCommentInput, 
      [postId]: !showCommentInput[postId] 
    });
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
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
        >
          Post
        </button>
      </form>

      <div>
        {posts.length === 0 && (
          <p className="text-gray-500 text-center">No posts yet. Be the first!</p>
        )}
        
        {posts.map(post => (
          <div key={post._id} className="border rounded p-4 mb-4 shadow">
            <div className="flex items-center mb-2">
              <span className="font-bold">{post.author_id?.name || 'Unknown'}</span>
              <span className="text-sm text-gray-500 ml-2">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>
            <p className="mb-2">{post.content}</p>
            
            <div className="flex mt-2">
              <button 
                onClick={() => handleLike(post._id)}
                className="text-blue-500 mr-4 hover:text-blue-700"
              >
                Like ({post.likes?.length || 0})
              </button>
              <button 
                onClick={() => toggleCommentInput(post._id)}
                className="text-gray-500 hover:text-gray-700"
              >
                Comment ({post.comments?.length || 0})
              </button>
            </div>

            {showCommentInput[post._id] && (
              <div className="mt-3 flex">
                <input
                  type="text"
                  value={commentText[post._id] || ''}
                  onChange={(e) => setCommentText({ 
                    ...commentText, 
                    [post._id]: e.target.value 
                  })}
                  placeholder="Write a comment..."
                  className="flex-1 border rounded p-2 mr-2"
                />
                <button
                  onClick={() => handleComment(post._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Post Comment
                </button>
              </div>
            )}

            {/* Display Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="mt-3 pl-4 border-l-2 border-gray-300">
                {post.comments.map(comment => (
                  <div key={comment._id} className="text-sm text-gray-700 py-1">
                    <strong>{comment.user_id?.name || 'Unknown'}:</strong> {comment.content}
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
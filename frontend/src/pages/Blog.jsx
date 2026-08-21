import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Blog = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const [myPosts, setMyPosts] = useState([]);
  const [publicPosts, setPublicPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [coverImage, setCoverImage] = useState(null); // base64 string
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [message, setMessage] = useState('');

  const fetchPosts = async () => {
    try {
      const myRes = await fetch('http://localhost:5000/api/blog/my-posts', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const myData = await myRes.json();
      setMyPosts(Array.isArray(myData) ? myData : []);

      const pubRes = await fetch('http://localhost:5000/api/blog/posts');
      const pubData = await pubRes.json();
      setPublicPosts(Array.isArray(pubData) ? pubData : []);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result); // store base64 string
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const postData = {
        title,
        content,
        category: category || 'General',
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        status,
        coverImage: coverImage || '' // base64 or empty
      };

      const res = await fetch('http://localhost:5000/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Post created successfully!');
        setTitle('');
        setContent('');
        setCategory('General');
        setTags('');
        setStatus('draft');
        setCoverImage(null);
        setCoverImagePreview('');
        fetchPosts();
      } else {
        setMessage('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Create post error:', err);
      setMessage('Error creating post.');
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading blog posts...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#1E2A5A] mb-4">Blog</h1>

      {message && (
        <p className={`mb-4 p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </p>
      )}

      {/* Create Post Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-[#1E2A5A] mb-4">Create New Post</h2>
        <form onSubmit={createPost}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#1E2A5A] focus:border-[#1E2A5A]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#1E2A5A] focus:border-[#1E2A5A]"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#1E2A5A] focus:border-[#1E2A5A]"
                placeholder="e.g., Technology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#1E2A5A] focus:border-[#1E2A5A]"
                placeholder="react, node, mongodb"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#1E2A5A] focus:border-[#1E2A5A]"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {coverImagePreview && (
                <img src={coverImagePreview} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded" />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#1E2A5A] text-white px-6 py-2 rounded-md hover:bg-[#2E3E7A] transition-colors"
          >
            Create Post
          </button>
        </form>
      </div>

      {/* My Posts */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#1E2A5A] mb-2">My Posts</h2>
        {myPosts.length === 0 ? (
          <p className="text-gray-500">You haven't written any posts yet.</p>
        ) : (
          <div className="space-y-4">
            {myPosts.map(post => (
              <div key={post._id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-[#1E2A5A]">{post.title}</h3>
                <p className="text-sm text-gray-500">Status: {post.status} | Category: {post.category}</p>
                <p className="text-sm text-gray-600">{post.excerpt || post.content.substring(0, 100)}...</p>
                <Link to={`/blog/${post._id}`} className="text-[#4A5DA6] hover:underline text-sm">Read More</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Public Posts */}
      <div>
        <h2 className="text-xl font-semibold text-[#1E2A5A] mb-2">Public Blog Posts</h2>
        {publicPosts.length === 0 ? (
          <p className="text-gray-500">No published posts yet.</p>
        ) : (
          <div className="space-y-4">
            {publicPosts.map(post => (
              <div key={post._id} className="bg-white rounded-lg shadow p-4">
                {post.coverImage && (
                  <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover rounded mb-2" />
                )}
                <h3 className="font-bold text-[#1E2A5A]">{post.title}</h3>
                <p className="text-sm text-gray-500">By {post.author_id?.name || 'Unknown'} | {post.category}</p>
                <p className="text-sm text-gray-600">{post.excerpt || post.content.substring(0, 150)}...</p>
                <Link to={`/blog/${post._id}`} className="text-[#4A5DA6] hover:underline text-sm">Read More</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
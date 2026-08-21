import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { user, login } = useAuth();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [avatar, setAvatar] = useState(null); // base64
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverImage, setCoverImage] = useState(null); // base64
  const [coverPreview, setCoverPreview] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Load current user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setLocation(user.location || '');
      setWebsite(user.website || '');
      setAvatarPreview(user.avatar || '');
      setCoverPreview(user.coverImage || '');
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 1. Upload avatar if changed
      if (avatar) {
        const avatarRes = await fetch('http://localhost:5000/api/profile/me/avatar', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ avatar })
        });
        const avatarData = await avatarRes.json();
        if (!avatarRes.ok) {
          setMessage('Avatar upload failed: ' + avatarData.error);
          setLoading(false);
          return;
        }
        // Update user's avatar in context
        user.avatar = avatarData.avatar;
      }

      // 2. Upload cover if changed
      if (coverImage) {
        const coverRes = await fetch('http://localhost:5000/api/profile/me/cover', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ coverImage })
        });
        const coverData = await coverRes.json();
        if (!coverRes.ok) {
          setMessage('Cover upload failed: ' + coverData.error);
          setLoading(false);
          return;
        }
        user.coverImage = coverData.coverImage;
      }

      // 3. Update profile fields (name, bio, location, website)
      const updateRes = await fetch('http://localhost:5000/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ name, bio, location, website })
      });
      const updateData = await updateRes.json();
      if (!updateRes.ok) {
        setMessage('Profile update failed: ' + updateData.error);
        setLoading(false);
        return;
      }

      // Update user context
      user.name = updateData.name;
      user.bio = updateData.bio;
      user.location = updateData.location;
      user.website = updateData.website;

      setMessage('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      console.error('Update error:', err);
      setMessage('Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#1E2A5A] mb-4">Edit Profile</h1>

      {message && (
        <p className={`mb-4 p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Avatar */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Avatar</label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">?</div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1E2A5A] file:text-white hover:file:bg-[#2E3E7A]"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cover Image</label>
          <div className="mb-2">
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="w-full h-32 object-cover rounded" />
            ) : (
              <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">No cover image</div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1E2A5A] file:text-white hover:file:bg-[#2E3E7A]"
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#1E2A5A] focus:border-[#1E2A5A]"
            required
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#1E2A5A] focus:border-[#1E2A5A]"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#1E2A5A] focus:border-[#1E2A5A]"
          />
        </div>

        {/* Website */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-[#1E2A5A] focus:border-[#1E2A5A]"
            placeholder="https://example.com"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1E2A5A] text-white px-6 py-2 rounded-md hover:bg-[#2E3E7A] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
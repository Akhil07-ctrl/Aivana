import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import PageWrapper from '../../components/layout/PageWrapper';
import useAuthStore from '../../store/authStore';
import { FiUser, FiMapPin, FiMail, FiEdit2, FiPlus, FiTrash2, FiCheckCircle, FiCamera, FiPhone, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal'); // personal, addresses
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (location.hash === '#addresses') {
      setActiveTab('addresses');
    }
  }, [location.hash]);

  const { data: userData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
      return res.data.data;
    },
    initialData: user,
  });

  // Start editing
  const handleStartEdit = () => {
    setEditData({
      name: userData?.name || '',
      email: userData?.email || '',
    });
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ name: '', email: '' });
  };

  // Save profile
  const updateProfileMutation = useMutation({
    mutationFn: (data) => axiosInstance.put('/users/profile', data),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['profile']);
      setUser(res.data.data);
      setIsEditing(false);
      toast.success('Profile updated!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleSaveProfile = () => {
    const updates = {};
    if (editData.name && editData.name !== userData.name) updates.name = editData.name;
    if (editData.email && editData.email !== userData.email) updates.email = editData.email;

    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }
    updateProfileMutation.mutate(updates);
  };

  // Avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axiosInstance.put('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      queryClient.invalidateQueries(['profile']);
      setUser(res.data.data);
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete address
  const deleteAddressMutation = useMutation({
    mutationFn: (addressId) => axiosInstance.delete(`/users/addresses/${addressId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      toast.success('Address removed');
    },
  });

  // Send reset link
  const handleSendResetLink = async () => {
    if (!userData?.email) {
      toast.error('Please add an email address first to reset your password');
      return;
    }
    const toastId = toast.loading('Sending reset link...');
    try {
      await axiosInstance.post('/auth/forgot-password', { email: userData.email });
      toast.success('Reset OTP sent to your email!', { id: toastId });
      navigate('/forgot-password', { state: { email: userData.email, step: 2 } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link', { id: toastId });
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-display text-2xl">Loading...</div>;

  return (
    <PageWrapper className="bg-cream-100 pt-6 sm:pt-10 pb-24">
      <div className="container-main max-w-5xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-display text-ink font-bold mb-1 sm:mb-2">My Profile</h1>
          <p className="text-ink-muted text-sm sm:text-base">Manage your personal information and delivery preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar — horizontal on mobile, vertical on desktop */}
          <div className="lg:col-span-1 flex lg:flex-col gap-3 sm:gap-4 overflow-x-auto pb-2 lg:pb-0">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all whitespace-nowrap ${activeTab === 'personal' ? 'bg-ink text-white shadow-xl shadow-ink/20' : 'bg-white text-ink-muted hover:bg-cream-200'}`}
            >
              <FiUser size={18} /> Personal Info
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all whitespace-nowrap ${activeTab === 'addresses' ? 'bg-ink text-white shadow-xl shadow-ink/20' : 'bg-white text-ink-muted hover:bg-cream-200'}`}
            >
              <FiMapPin size={18} /> Addresses
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'personal' && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-card animate-fade-in">
                {/* Avatar & Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-cream-100">
                  <div className="relative group flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-cream-200 overflow-hidden ring-4 ring-white shadow-lg">
                      {userData.avatar?.url ? (
                        <img src={userData.avatar.url} className="w-full h-full object-cover" alt="Avatar" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink-muted">
                          <FiUser size={32} />
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 p-2 bg-rose-brand text-white rounded-full shadow-lg hover:bg-rose-dark transition-colors"
                    >
                      <FiCamera size={14} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-ink truncate">{userData.name}</h2>
                    {userData.email && (
                      <p className="text-ink-muted flex items-center justify-center sm:justify-start gap-2 mt-1 text-sm truncate">
                        <FiMail size={14} className="flex-shrink-0" /> <span className="truncate">{userData.email}</span>
                      </p>
                    )}
                    {userData.phone && (
                      <p className="text-ink-muted flex items-center justify-center sm:justify-start gap-2 mt-1 text-sm">
                        <FiPhone size={14} className="flex-shrink-0" /> {userData.phone}
                      </p>
                    )}
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-widest">
                      <FiCheckCircle size={12} /> Verified Account
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={handleStartEdit}
                      className="btn-outline flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm self-center sm:self-start w-full sm:w-auto justify-center"
                    >
                      <FiEdit2 size={14} /> Edit Profile
                    </button>
                  )}
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">Full Name</label>
                    {isEditing ? (
                      <input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="input"
                        placeholder="Your name"
                      />
                    ) : (
                      <input disabled value={userData.name} className="input bg-cream-50 cursor-not-allowed opacity-80" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="input"
                        placeholder="you@example.com"
                      />
                    ) : (
                      <input disabled value={userData.email || 'Not set'} className="input bg-cream-50 cursor-not-allowed opacity-80" />
                    )}
                  </div>
                  {userData.phone && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">Phone Number</label>
                      <input disabled value={userData.phone} className="input bg-cream-50 cursor-not-allowed opacity-80" />
                    </div>
                  )}
                </div>

                {/* Save / Cancel buttons */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      className="btn-primary flex items-center justify-center gap-2 px-8 py-3 rounded-xl shadow-lg shadow-rose-brand/10 w-full sm:w-auto"
                    >
                      {updateProfileMutation.isPending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <><FiSave size={16} /> Save Changes</>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn-outline flex items-center justify-center gap-2 px-6 py-3 rounded-xl w-full sm:w-auto"
                    >
                      <FiX size={16} /> Cancel
                    </button>
                  </div>
                )}

                {/* Password & Security */}
                <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-cream-50 rounded-xl sm:rounded-2xl border border-cream-200">
                  <h4 className="font-bold text-ink mb-2">Password & Security</h4>
                  <p className="text-sm text-ink-muted mb-4">Want to change your password? We'll send a secure link to your email.</p>
                  <button
                    onClick={handleSendResetLink}
                    className="btn-outline px-6 py-2 rounded-xl text-sm w-full sm:w-auto"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4 sm:space-y-6 animate-fade-in" id="addresses">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-ink">My Saved Addresses</h2>
                  <button className="btn-primary flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl shadow-rose-brand/20 w-full sm:w-auto justify-center text-sm sm:text-base">
                    <FiPlus /> Add New Address
                  </button>
                </div>

                {(!userData.addresses || userData.addresses.length === 0) ? (
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center shadow-card">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-ink-muted">
                      <FiMapPin size={30} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-ink mb-2">No addresses saved</h3>
                    <p className="text-ink-muted text-sm sm:text-base mb-6 sm:mb-8">Add your delivery address to enjoy a faster checkout experience.</p>
                    <button className="btn-outline px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl w-full sm:w-auto">Add Your First Address</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userData.addresses.map((address) => (
                      <div key={address._id} className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm relative group hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${address.label === 'Home' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                            {address.label}
                          </span>
                          {address.isDefault && (
                            <span className="text-[10px] font-bold text-rose-brand uppercase tracking-widest flex items-center gap-1">
                              <FiCheckCircle size={10} /> Default
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-ink mb-1">{address.fullName}</h4>
                        <p className="text-sm text-ink-light leading-relaxed mb-4">
                          {address.line1}, {address.line2 && address.line2 + ','}<br />
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm font-semibold text-ink-muted mb-6">Phone: {address.phone}</p>

                        <div className="flex gap-4 border-t border-cream-100 pt-4">
                          <button className="text-xs font-bold text-ink hover:text-rose-brand transition-colors flex items-center gap-1.5">
                            <FiEdit2 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => deleteAddressMutation.mutate(address._id)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5"
                          >
                            <FiTrash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

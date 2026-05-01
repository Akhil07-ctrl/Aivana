import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import PageWrapper from '../../components/layout/PageWrapper';
import useAuthStore from '../../store/authStore';
import { FiUser, FiMapPin, FiMail, FiEdit2, FiPlus, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('personal'); // personal, addresses

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

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId) => axiosInstance.delete(`/users/addresses/${addressId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      toast.success('Address removed');
    },
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-display text-2xl">Loading...</div>;

  return (
    <PageWrapper className="bg-cream-100 pt-10 pb-24">
      <div className="container-main max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-ink font-bold mb-2">My Profile</h1>
          <p className="text-ink-muted">Manage your personal information and delivery preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <button
              onClick={() => setActiveTab('personal')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'personal' ? 'bg-ink text-white shadow-xl shadow-ink/20' : 'bg-white text-ink-muted hover:bg-cream-200'}`}
            >
              <FiUser size={20} /> Personal Info
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'addresses' ? 'bg-ink text-white shadow-xl shadow-ink/20' : 'bg-white text-ink-muted hover:bg-cream-200'}`}
            >
              <FiMapPin size={20} /> Addresses
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'personal' && (
              <div className="bg-white rounded-3xl p-8 shadow-card animate-fade-in">
                <div className="flex items-center gap-6 mb-10 pb-10 border-b border-cream-100">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-cream-200 overflow-hidden ring-4 ring-white shadow-lg">
                      {userData.avatar?.url ? (
                        <img src={userData.avatar.url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink-muted">
                          <FiUser size={40} />
                        </div>
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-rose-brand text-white rounded-full shadow-lg hover:bg-rose-dark transition-colors">
                      <FiEdit2 size={14} />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-ink">{userData.name}</h2>
                    <p className="text-ink-muted flex items-center gap-2 mt-1">
                      <FiMail size={14} /> {userData.email}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-widest">
                      <FiCheckCircle size={12} /> Verified Account
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <input disabled value={userData.name} className="input bg-cream-50 cursor-not-allowed opacity-80" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <input disabled value={userData.email} className="input bg-cream-50 cursor-not-allowed opacity-80" />
                  </div>
                  {/* Password change logic would go here */}
                </div>

                <div className="mt-12 p-6 bg-cream-50 rounded-2xl border border-cream-200">
                  <h4 className="font-bold text-ink mb-2">Password & Security</h4>
                  <p className="text-sm text-ink-muted mb-4">Want to change your password? We'll send a secure link to your email.</p>
                  <button className="btn-outline px-6 py-2 rounded-xl text-sm">Send Reset Link</button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6 animate-fade-in" id="addresses">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-ink">My Saved Addresses</h2>
                  <button className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl shadow-xl shadow-rose-brand/20">
                    <FiPlus /> Add New Address
                  </button>
                </div>

                {(!userData.addresses || userData.addresses.length === 0) ? (
                  <div className="bg-white rounded-3xl p-16 text-center shadow-card">
                    <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6 text-ink-muted">
                      <FiMapPin size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-ink mb-2">No addresses saved</h3>
                    <p className="text-ink-muted mb-8">Add your delivery address to enjoy a faster checkout experience.</p>
                    <button className="btn-outline px-8 py-3 rounded-2xl">Add Your First Address</button>
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

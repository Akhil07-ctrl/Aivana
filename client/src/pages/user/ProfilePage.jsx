import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import PageWrapper from "../../components/layout/PageWrapper";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import ProductCard from "../../components/product/ProductCard";
import {
  FiUser,
  FiMapPin,
  FiMail,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiCamera,
  FiPhone,
  FiSave,
  FiX,
  FiPackage,
  FiHeart,
  FiChevronRight,
  FiClock,
  FiTruck,
  FiCreditCard,
  FiLock,
  FiRepeat,
  FiHelpCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { items: wishlistItems, setItems: setWishlistItems } = useWishlistStore();
  const { addToCart } = useCartStore();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("personal"); // personal, orders, addresses, wishlist
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [isWishlistSyncing, setIsWishlistSyncing] = useState(false);
  const fileInputRef = useRef(null);

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReorder = async (orderItems) => {
    const toastId = toast.loading("Adding items to cart...");
    try {
      for (const item of orderItems) {
        await addToCart({
          productId: item.product?._id || item.product,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          productData: {
            name: item.name,
            price: item.price,
            images: [{ url: item.image }],
          },
        });
      }
      toast.success("All items added to cart! 🛍️", { id: toastId });
    } catch (err) {
      toast.error("Failed to add some items", { id: toastId });
    }
  };

  // Sync wishlist with server when tab is active
  useEffect(() => {
    if (activeTab === 'wishlist' && wishlistItems.length > 0) {
      const syncWishlist = async () => {
        setIsWishlistSyncing(true);
        try {
          const ids = wishlistItems.map(item => item._id).join(',');
          const res = await axiosInstance.get('/products', { params: { ids, limit: 100 } });
          const freshProducts = res.data.data.products || [];
          
          // Only update if something changed (count or any price/stock update)
          if (freshProducts.length !== wishlistItems.length || JSON.stringify(freshProducts) !== JSON.stringify(wishlistItems)) {
            setWishlistItems(freshProducts);
          }
        } catch (error) {
          console.error('Wishlist sync failed:', error);
        } finally {
          setIsWishlistSyncing(false);
        }
      };
      syncWishlist();
    }
  }, [activeTab]);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    label: "Home",
    isDefault: false,
  });

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (["personal", "orders", "addresses", "wishlist"].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data.data;
    },
    initialData: user,
  });

  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosInstance.get("/orders/my-orders");
      return res.data.data;
    },
    enabled: activeTab === "orders",
  });

  // Profile Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (data) => axiosInstance.put("/users/profile", data),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["profile"]);
      setUser(res.data.data);
      setIsEditing(false);
      toast.success("Profile updated!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  // Address Mutations
  const addAddressMutation = useMutation({
    mutationFn: (data) => axiosInstance.post("/users/addresses", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      setIsAddressModalOpen(false);
      toast.success("Address added!");
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to add address"),
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }) =>
      axiosInstance.put(`/users/addresses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      setIsAddressModalOpen(false);
      toast.success("Address updated!");
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to update address"),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId) =>
      axiosInstance.delete(`/users/addresses/${addressId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      toast.success("Address removed");
    },
  });

  const handleStartEdit = () => {
    setEditData({
      name: userData?.name || "",
      email: userData?.email || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ name: "", email: "" });
  };

  const handleSaveProfile = () => {
    const updates = {};
    if (editData.name && editData.name !== userData.name)
      updates.name = editData.name;
    if (editData.email && editData.email !== userData.email)
      updates.email = editData.email;

    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }
    updateProfileMutation.mutate(updates);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await axiosInstance.put("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      queryClient.invalidateQueries(["profile"]);
      setUser(res.data.data);
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setAddressFormData({ ...address });
    } else {
      setEditingAddress(null);
      setAddressFormData({
        fullName: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
        label: "Home",
        isDefault: false,
      });
    }
    setIsAddressModalOpen(true);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddressMutation.mutate({
        id: editingAddress._id,
        data: addressFormData,
      });
    } else {
      addAddressMutation.mutate(addressFormData);
    }
  };

  const handleSendResetLink = async () => {
    if (!userData?.email) {
      toast.error("Please add an email address first to reset your password");
      return;
    }
    const toastId = toast.loading("Sending reset link...");
    try {
      await axiosInstance.post("/auth/forgot-password", {
        email: userData.email,
      });
      toast.success("Reset OTP sent to your email!", { id: toastId });
      navigate("/forgot-password", {
        state: { email: userData.email, step: 2 },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset link",
        { id: toastId },
      );
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-ink-muted font-medium animate-pulse">
            Tailoring your experience...
          </p>
        </div>
      </div>
    );

  const tabs = [
    { id: "personal", label: "Personal Info", icon: <FiUser size={18} /> },
    { id: "orders", label: "My Orders", icon: <FiPackage size={18} /> },
    { id: "addresses", label: "Addresses", icon: <FiMapPin size={18} /> },
    { id: "wishlist", label: "Wishlist", icon: <FiHeart size={18} /> },
  ];

  return (
    <PageWrapper className="bg-cream-100/50 pt-10 pb-24 min-h-screen">
      <div className="container-main max-w-6xl">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-display text-ink font-bold mb-2">
            My Account
          </h1>
          <p className="text-ink-muted text-lg">
            Manage your profile, orders, and preferences in one place.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-28">
            <div className="bg-white rounded-[2rem] p-4 lg:p-6 shadow-xl shadow-cream-200 border border-cream-100 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.location.hash = tab.id;
                  }}
                  className={`relative flex items-center justify-center lg:justify-start gap-3 px-4 lg:px-6 py-3.5 lg:py-4 rounded-2xl font-bold transition-all flex-1 lg:flex-none whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-ink rounded-2xl shadow-lg shadow-ink/20"
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.2,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${activeTab === tab.id ? "text-white" : "text-rose-brand"}`}
                  >
                    {tab.icon}
                  </span>
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}

              <div className="hidden lg:block mt-8 pt-6 border-t border-cream-100">
                <button
                  onClick={() => {
                    useAuthStore.getState().logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-3 px-5 py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all hover:pl-7"
                >
                  <FiTrash2 size={18} />
                  Log Out
                </button>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0 w-full">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-cream-200 border border-cream-100 min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Personal Info Tab */}
                  {activeTab === "personal" && (
                    <div className="space-y-10">
                      <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-cream-50">
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-full bg-cream-100 overflow-hidden ring-4 ring-white shadow-2xl transition-transform group-hover:scale-105 duration-500">
                            {userData.avatar?.url ? (
                              <img
                                src={userData.avatar.url}
                                className="w-full h-full object-cover"
                                alt="Avatar"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-ink-muted bg-cream-50">
                                <FiUser size={56} />
                              </div>
                            )}
                            {isUploading && (
                              <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
                                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 p-3 bg-rose-brand text-white rounded-full shadow-xl hover:bg-rose-700 transition-all hover:scale-110 active:scale-95"
                          >
                            <FiCamera size={18} />
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                              <h2 className="text-3xl font-display font-bold text-ink mb-1">
                                {userData.name}
                              </h2>
                              <p className="text-ink-muted flex items-center justify-center md:justify-start gap-2 text-sm">
                                <FiMail className="text-rose-brand" />{" "}
                                {userData.email}
                              </p>
                            </div>
                            {!isEditing && (
                              <button
                                onClick={handleStartEdit}
                                className="btn-outline flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-sm bg-white"
                              >
                                <FiEdit2 size={14} /> Edit Profile
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="px-4 py-1.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-2 border border-green-100 shadow-sm">
                              <FiCheckCircle size={14} /> Verified Account
                            </span>
                            <span className="px-4 py-1.5 bg-rose-50 text-rose-brand text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-2 border border-rose-100 shadow-sm">
                              <FiCreditCard size={14} /> Elite Member
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">
                            Full Name
                          </label>
                          <input
                            disabled={!isEditing}
                            value={isEditing ? editData.name : userData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            className={`w-full px-6 py-4 rounded-2xl border transition-all text-sm font-semibold ${
                              isEditing
                                ? "border-rose-brand focus:ring-4 focus:ring-rose-brand/5 bg-white"
                                : "border-cream-100 bg-cream-50/50 cursor-not-allowed"
                            }`}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">
                            Email Address
                          </label>
                          <input
                            disabled={!isEditing}
                            value={isEditing ? editData.email : userData.email}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                email: e.target.value,
                              })
                            }
                            className={`w-full px-6 py-4 rounded-2xl border transition-all text-sm font-semibold ${
                              isEditing
                                ? "border-rose-brand focus:ring-4 focus:ring-rose-brand/5 bg-white"
                                : "border-cream-100 bg-cream-50/50 cursor-not-allowed"
                            }`}
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={handleSaveProfile}
                            disabled={updateProfileMutation.isPending}
                            className="btn-primary flex-1 sm:flex-none px-10 py-4 rounded-2xl shadow-xl shadow-rose-brand/20 flex items-center justify-center gap-2"
                          >
                            {updateProfileMutation.isPending ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <FiSave size={20} /> Save Changes
                              </>
                            )}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="btn-outline flex-1 sm:flex-none px-10 py-4 rounded-2xl bg-white"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      <div className="p-8 bg-ink rounded-3xl text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                          <FiLock size={120} />
                        </div>
                        <div className="relative z-10">
                          <h4 className="font-display text-2xl font-bold mb-2">
                            Password & Security
                          </h4>
                          <p className="text-white/70 text-sm mb-6 max-w-md">
                            Keep your account secure. If you've forgotten your
                            password or want to update it, we'll send a secure
                            link.
                          </p>
                          <button
                            onClick={handleSendResetLink}
                            className="px-8 py-3 bg-white text-ink font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-rose-brand hover:text-white transition-all shadow-xl"
                          >
                            Send Reset Link
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "orders" && (
                    <div className="space-y-10">
                      <div className="flex items-center justify-between gap-4 pb-8 border-b border-cream-50">
                        <div>
                          <h2 className="text-3xl font-display font-bold text-ink">
                            Order History
                          </h2>
                          <p className="text-ink-muted/60 text-xs font-bold uppercase tracking-widest mt-1">
                            Management & Tracking
                          </p>
                        </div>
                        <div className="px-4 py-2 bg-cream-50 rounded-xl border border-cream-100">
                          <span className="text-sm font-bold text-ink">
                            {orders?.length || 0}
                          </span>
                          <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest ml-2">
                            Items
                          </span>
                        </div>
                      </div>

                      {isOrdersLoading ? (
                        <div className="py-24 flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-rose-brand border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm font-bold text-ink-muted animate-pulse">
                            Retreiving your style investments...
                          </p>
                        </div>
                      ) : orders?.length === 0 ? (
                        <div className="py-24 text-center bg-cream-50/50 rounded-[3rem] border border-cream-100 border-dashed">
                          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-card border border-cream-50">
                            <FiPackage
                              size={48}
                              className="text-ink-muted/20"
                            />
                          </div>
                          <h3 className="text-2xl font-display font-bold text-ink mb-2">
                            No orders yet
                          </h3>
                          <p className="text-ink-muted mb-10 max-w-sm mx-auto leading-relaxed">
                            It looks like you haven't placed any orders yet.
                            Start exploring our premium collections.
                          </p>
                          <Link
                            to="/shop"
                            className="btn-primary px-10 py-4 rounded-2xl shadow-xl shadow-rose-brand/20"
                          >
                            Start Shopping
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-8">
                          {orders?.map((order, idx) => {
                            const isExpanded = expandedOrders[order._id];
                            return (
                              <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-[2.5rem] border border-cream-100 overflow-hidden shadow-xl shadow-cream-200/50 hover:shadow-2xl hover:shadow-rose-brand/5 transition-all duration-500 group"
                              >
                                {/* Order Header */}
                                <div className="p-6 sm:p-8 border-b border-cream-50">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                    <div className="flex items-center gap-4">
                                      <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${order.isDelivered ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-brand"} border border-current/10`}
                                      >
                                        <FiPackage size={24} />
                                      </div>
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <h4 className="font-mono text-xs font-bold text-ink">
                                            #{order._id.slice(-8).toUpperCase()}
                                          </h4>
                                          <span
                                            className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                              order.isDelivered
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-rose-50 text-rose-brand"
                                            }`}
                                          >
                                            {order.isDelivered
                                              ? "Delivered"
                                              : "In Transit"}
                                          </span>
                                        </div>
                                        <p className="text-[10px] font-bold text-ink-muted/60 uppercase tracking-widest">
                                          {new Date(
                                            order.createdAt,
                                          ).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                                      <div className="text-right">
                                        <p className="text-[9px] font-bold text-ink-muted uppercase tracking-widest mb-0.5">
                                          Amount
                                        </p>
                                        <p className="text-xl font-bold text-ink">
                                          ₹{order.totalPrice.toLocaleString()}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Link
                                          to={`/track-order/${order._id}`}
                                          className="p-3 bg-ink text-white rounded-xl hover:bg-rose-brand transition-all shadow-lg shadow-ink/10"
                                          title="Track Order"
                                        >
                                          <FiTruck size={18} />
                                        </Link>
                                        <button
                                          onClick={() => toggleOrder(order._id)}
                                          className={`p-3 rounded-xl transition-all ${isExpanded ? "bg-ink text-white" : "bg-cream-50 text-ink-muted hover:bg-cream-100"}`}
                                        >
                                          {isExpanded ? (
                                            <FiChevronUp size={18} />
                                          ) : (
                                            <FiChevronDown size={18} />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      {/* Detailed Grid */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-cream-50 bg-cream-50/20">
                                        <div className="p-6 border-b md:border-b-0 md:border-r border-cream-50">
                                          <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <FiMapPin className="text-rose-brand" />{" "}
                                            Destination
                                          </p>
                                          <p className="text-xs font-bold text-ink leading-relaxed">
                                            {order.shippingAddress.address},{" "}
                                            {order.shippingAddress.city}
                                            <br />
                                            {order.shippingAddress.postalCode}
                                          </p>
                                        </div>
                                        <div className="p-6">
                                          <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <FiCreditCard className="text-rose-brand" />{" "}
                                            Payment
                                          </p>
                                          <p className="text-xs font-bold text-ink">
                                            Paid via{" "}
                                            {order.paymentMethod || "Razorpay"}
                                          </p>
                                          <button className="text-[10px] font-bold text-rose-brand mt-2 hover:underline">
                                            Download Invoice
                                          </button>
                                        </div>
                                      </div>

                                      {/* Items Preview */}
                                      <div className="bg-white p-6 sm:p-8">
                                        <div className="space-y-6">
                                          {order.orderItems.map((item, i) => (
                                            <div
                                              key={i}
                                              className="flex gap-4 items-center group/item"
                                            >
                                              <div className="w-16 h-20 bg-white rounded-xl overflow-hidden border border-cream-100 flex-shrink-0 shadow-sm relative">
                                                <img
                                                  src={item.image}
                                                  alt={item.name}
                                                  className="w-full h-full object-cover transition-transform group-hover/item:scale-110"
                                                />
                                              </div>
                                              <div className="flex-1">
                                                <Link
                                                  to={`/products/${item.product?.slug || "#"}`}
                                                  className="font-bold text-ink hover:text-rose-brand transition-colors line-clamp-1"
                                                >
                                                  {item.name}
                                                </Link>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                                                  {item.size && (
                                                    <span>
                                                      Size:{" "}
                                                      <span className="text-rose-brand">
                                                        {item.size}
                                                      </span>
                                                    </span>
                                                  )}
                                                  {item.color && (
                                                    <span>
                                                      Color:{" "}
                                                      <span className="text-rose-brand">
                                                        {item.color}
                                                      </span>
                                                    </span>
                                                  )}
                                                  <span>
                                                    Qty:{" "}
                                                    <span className="text-ink">
                                                      {item.quantity}
                                                    </span>
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <p className="font-bold text-ink">
                                                  ₹{item.price.toLocaleString()}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Status Progress Footer */}
                                <div className="px-8 py-4 bg-white border-t border-cream-50 flex items-center gap-4">
                                  <div className="flex-1 h-1.5 bg-cream-100 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{
                                        width: order.isDelivered
                                          ? "100%"
                                          : order.isPaid
                                            ? "40%"
                                            : "10%",
                                      }}
                                      transition={{
                                        duration: 1,
                                        ease: "easeOut",
                                      }}
                                      className={`h-full ${order.isDelivered ? "bg-emerald-500" : "bg-rose-brand"}`}
                                    />
                                  </div>
                                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest whitespace-nowrap">
                                    {order.isDelivered
                                      ? "Order Fulfilled"
                                      : "In Transit"}
                                  </span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Addresses Tab */}
                  {activeTab === "addresses" && (
                    <div className="space-y-10">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-cream-50">
                        <div className="space-y-1">
                          <h2 className="text-2xl md:text-3xl font-display font-bold text-ink">
                            Addresses
                          </h2>
                          <p className="text-ink-muted/60 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                            Delivery Destinations
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenAddressModal()}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-ink text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-brand transition-all shadow-lg shadow-ink/10 flex items-center justify-center gap-2"
                        >
                          <FiPlus /> New Address
                        </button>
                      </div>

                      {!userData.addresses ||
                      userData.addresses.length === 0 ? (
                        <div className="py-24 text-center bg-cream-50/50 rounded-[3rem] border border-cream-100 border-dashed">
                          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-card border border-cream-50">
                            <FiMapPin size={48} className="text-ink-muted/20" />
                          </div>
                          <h3 className="text-2xl font-display font-bold text-ink mb-2">
                            Address book empty
                          </h3>
                          <p className="text-ink-muted mb-10 max-w-sm mx-auto leading-relaxed text-sm">
                            Save your delivery addresses now for a seamless
                            checkout experience later.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                          {userData.addresses.map((address) => (
                            <div
                              key={address._id}
                              className="group relative bg-white rounded-[2.5rem] border border-cream-100 p-8 hover:border-rose-brand transition-all duration-500 hover:shadow-2xl hover:shadow-cream-200/50 overflow-hidden"
                            >
                              {/* Background Accent */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-cream-50 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-700 opacity-50" />

                              <div className="relative z-10 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-8">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                      <h4 className="text-xl font-display font-bold text-ink">
                                        {address.fullName}
                                      </h4>
                                      <span
                                        className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                                          address.label === "Home"
                                            ? "bg-blue-50 text-blue-600 border-blue-100"
                                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        }`}
                                      >
                                        {address.label}
                                      </span>
                                    </div>
                                    {address.isDefault && (
                                      <p className="text-[10px] font-bold text-rose-brand uppercase tracking-[0.2em] flex items-center gap-1.5">
                                        <FiCheckCircle size={12} /> Default
                                        Destination
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex-1 space-y-6">
                                  <div className="space-y-2">
                                    <p className="text-[9px] font-bold text-ink-muted uppercase tracking-[0.2em]">
                                      Address Details
                                    </p>
                                    <p className="text-sm font-semibold text-ink leading-relaxed max-w-[280px]">
                                      {address.line1}
                                      {address.line2
                                        ? `, ${address.line2}`
                                        : ""}
                                      <br />
                                      {address.city}, {address.state} -{" "}
                                      <span className="text-rose-brand">
                                        {address.pincode}
                                      </span>
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <div className="flex-1 space-y-2">
                                      <p className="text-[9px] font-bold text-ink-muted uppercase tracking-[0.2em]">
                                        Contact
                                      </p>
                                      <div className="flex items-center gap-2 text-sm font-bold text-ink">
                                        <div className="w-8 h-8 rounded-lg bg-cream-50 flex items-center justify-center text-rose-brand">
                                          <FiPhone size={14} />
                                        </div>
                                        {address.phone}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-cream-50 flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      handleOpenAddressModal(address)
                                    }
                                    className="flex-1 py-3.5 rounded-2xl bg-ink text-white font-bold text-xs uppercase tracking-widest hover:bg-rose-brand transition-all shadow-xl shadow-ink/10"
                                  >
                                    Edit Address
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          "Are you sure you want to remove this destination?",
                                        )
                                      )
                                        deleteAddressMutation.mutate(
                                          address._id,
                                        );
                                    }}
                                    className="p-3.5 rounded-2xl bg-rose-50 text-rose-brand hover:bg-rose-brand hover:text-white transition-all border border-rose-100"
                                    title="Delete Destination"
                                  >
                                    <FiTrash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Wishlist Tab */}
                  {activeTab === "wishlist" && (
                    <div className="space-y-10">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-ink">
                          My Wishlist
                        </h2>
                        <div className="flex items-center gap-3">
                          {isWishlistSyncing && (
                            <div className="w-4 h-4 border-2 border-rose-brand border-t-transparent rounded-full animate-spin" />
                          )}
                          <p className="text-sm font-bold text-rose-brand bg-rose-50 px-5 py-1.5 rounded-full">
                            {wishlistItems.length} Favorite Styles
                          </p>
                        </div>
                      </div>

                      {wishlistItems.length === 0 ? (
                        <div className="py-24 text-center bg-cream-50/50 rounded-[3rem] border border-cream-100 border-dashed">
                          <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-card text-rose-brand">
                            <FiHeart size={48} className="fill-rose-brand/10" />
                          </div>
                          <h3 className="text-2xl font-display font-bold text-ink mb-2">
                            Your wishlist is empty
                          </h3>
                          <p className="text-ink-muted mb-10 max-w-sm mx-auto leading-relaxed">
                            Save the pieces you love to keep an eye on them.
                            Your future wardrobe starts here.
                          </p>
                          <Link
                            to="/shop"
                            className="btn-primary px-10 py-4 rounded-2xl shadow-xl shadow-rose-brand/20"
                          >
                            Explore Collections
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                          {wishlistItems.map((product) => (
                            <ProductCard key={product._id} product={product} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      {/* Address Modal */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute inset-0 bg-ink/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-display font-bold text-ink">
                    {editingAddress ? "Update Address" : "New Destination"}
                  </h3>
                  <button
                    onClick={() => setIsAddressModalOpen(false)}
                    className="p-3 text-ink-muted hover:text-rose-brand transition-all hover:bg-cream-50 rounded-full bg-cream-50/30"
                  >
                    <FiX size={28} />
                  </button>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">
                        Full Name
                      </label>
                      <input
                        required
                        value={addressFormData.fullName}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            fullName: e.target.value,
                          })
                        }
                        className="input h-14 bg-cream-50/50 border-cream-100 focus:bg-white transition-all"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">
                        Phone Number
                      </label>
                      <input
                        required
                        value={addressFormData.phone}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            phone: e.target.value,
                          })
                        }
                        className="input h-14 bg-cream-50/50 border-cream-100 focus:bg-white transition-all"
                        placeholder="10-digit number"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">
                        Address Line 1
                      </label>
                      <input
                        required
                        value={addressFormData.line1}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            line1: e.target.value,
                          })
                        }
                        className="input h-14 bg-cream-50/50 border-cream-100 focus:bg-white transition-all"
                        placeholder="House / Flat No, Street, Landmark"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        value={addressFormData.line2}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            line2: e.target.value,
                          })
                        }
                        className="input h-14 bg-cream-50/50 border-cream-100 focus:bg-white transition-all"
                        placeholder="Apartment, Locality, etc."
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">
                        City
                      </label>
                      <input
                        required
                        value={addressFormData.city}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            city: e.target.value,
                          })
                        }
                        className="input h-14 bg-cream-50/50 border-cream-100 focus:bg-white transition-all"
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">
                        State
                      </label>
                      <input
                        required
                        value={addressFormData.state}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            state: e.target.value,
                          })
                        }
                        className="input h-14 bg-cream-50/50 border-cream-100 focus:bg-white transition-all"
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">
                        Pincode
                      </label>
                      <input
                        required
                        value={addressFormData.pincode}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            pincode: e.target.value,
                          })
                        }
                        className="input h-14 bg-cream-50/50 border-cream-100 focus:bg-white transition-all"
                        placeholder="6-digit PIN"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] ml-1">
                        Address Label
                      </label>
                      <div className="flex gap-4">
                        {["Home", "Office"].map((label) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() =>
                              setAddressFormData({ ...addressFormData, label })
                            }
                            className={`flex-1 h-14 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
                              addressFormData.label === label
                                ? "bg-ink text-white shadow-xl shadow-ink/20"
                                : "bg-cream-50 text-ink-muted hover:bg-cream-100"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-4 px-6 bg-cream-50/50 rounded-[1.5rem] border border-cream-100/50">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id="isDefaultModal"
                        checked={addressFormData.isDefault}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            isDefault: e.target.checked,
                          })
                        }
                        className="w-6 h-6 rounded-lg border-cream-300 text-rose-brand focus:ring-rose-brand transition-all cursor-pointer"
                      />
                    </div>
                    <label
                      htmlFor="isDefaultModal"
                      className="text-sm font-bold text-ink cursor-pointer select-none"
                    >
                      Set as my primary delivery address
                    </label>
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button
                      type="submit"
                      disabled={
                        addAddressMutation.isPending ||
                        updateAddressMutation.isPending
                      }
                      className="btn-primary flex-1 py-5 rounded-2xl shadow-xl shadow-rose-brand/30 text-base font-bold tracking-wide"
                    >
                      {addAddressMutation.isPending ||
                      updateAddressMutation.isPending ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                      ) : editingAddress ? (
                        "Update Details"
                      ) : (
                        "Save Destination"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(false)}
                      className="btn-outline px-10 py-5 rounded-2xl bg-white border-cream-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiCheckCircle, FiThumbsUp, FiMessageSquare, FiSend, FiPlus } from 'react-icons/fi';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

export default function ProductReviews({ productId, averageRating, numOfReviews }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch reviews
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/reviews/${productId}`);
      return res.data.data;
    }
  });

  const reviews = data?.reviews || [];

  // Submit review mutation
  const mutation = useMutation({
    mutationFn: async (newReview) => {
      const res = await axiosInstance.post(`/reviews/${productId}`, newReview);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', productId]);
      queryClient.invalidateQueries(['product']); // Broader invalidation to catch 'product' + slug
      toast.success('Review submitted successfully!');
      setIsFormOpen(false);
      setRating(5);
      setTitle('');
      setComment('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to leave a review');
    mutation.mutate({ rating, title, comment });
  };

  const hasUserReviewed = reviews.some(r => r.user?._id === user?._id);

  return (
    <div className="mt-20 border-t border-cream-200 pt-16 pb-24">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Rating Summary Area */}
        <div className="lg:w-1/3">
          <h2 className="font-display text-3xl font-bold text-ink mb-8">Customer Reviews</h2>
          
          <div className="bg-cream-50 rounded-[2rem] p-8 border border-cream-200">
            <div className="flex items-center gap-6 mb-8">
              <div className="text-6xl font-bold text-ink">
                {averageRating?.toFixed(1) || '0.0'}
              </div>
              <div>
                <div className="flex text-yellow-500 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FiStar key={s} className={s <= Math.round(averageRating) ? 'fill-yellow-500' : 'text-cream-200'} size={20} />
                  ))}
                </div>
                <p className="text-sm font-medium text-ink-muted">Based on {numOfReviews || 0} reviews</p>
              </div>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="space-y-3 mb-8">
              {[5, 4, 3, 2, 1].map((num) => {
                const count = reviews.filter(r => Math.round(r.rating) === num).length;
                const percentage = numOfReviews > 0 ? (count / numOfReviews) * 100 : 0;
                return (
                  <div key={num} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-ink w-3">{num}</span>
                    <FiStar className="text-ink-muted" size={12} />
                    <div className="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full bg-ink rounded-full"
                      />
                    </div>
                    <span className="text-xs text-ink-muted w-8 text-right">{Math.round(percentage)}%</span>
                  </div>
                );
              })}
            </div>

            {user && !hasUserReviewed && !isFormOpen && (
              <button 
                onClick={() => setIsFormOpen(true)}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 shadow-lg shadow-rose-brand/10"
              >
                <FiPlus size={18} /> Write a Review
              </button>
            )}

            {!user && (
              <p className="text-center text-sm text-ink-muted italic border-t border-cream-200 pt-4 mt-4">
                Please login to share your experience
              </p>
            )}
          </div>
        </div>

        {/* Review List Area */}
        <div className="lg:w-2/3">
          <AnimatePresence mode="wait">
            {isFormOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[2rem] p-8 border-2 border-rose-brand/20 shadow-xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-ink">Your Style Review</h3>
                  <button onClick={() => setIsFormOpen(false)} className="text-ink-muted hover:text-rose-brand text-sm font-bold uppercase tracking-widest">Cancel</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-ink-muted uppercase tracking-wider mb-3">Overall Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onMouseEnter={() => setHoverRating(num)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(num)}
                          className="transition-transform hover:scale-110 active:scale-95"
                        >
                          <FiStar 
                            size={32} 
                            className={`${(hoverRating || rating) >= num ? 'text-yellow-500 fill-yellow-500' : 'text-cream-300'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-ink-muted uppercase tracking-wider mb-2">Review Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Sum it up in a few words"
                      className="w-full bg-cream-50 border-none rounded-xl p-4 text-ink focus:ring-2 focus:ring-rose-brand transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-ink-muted uppercase tracking-wider mb-2">Detailed Feedback</label>
                    <textarea 
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you love about this piece? How was the fit?"
                      className="w-full bg-cream-50 border-none rounded-xl p-4 text-ink focus:ring-2 focus:ring-rose-brand transition-all outline-none resize-none"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={mutation.isPending}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg shadow-xl shadow-rose-brand/20"
                  >
                    {mutation.isPending ? 'Publishing...' : <><FiSend size={20} /> Publish Review</>}
                  </button>
                </form>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {reviews.length === 0 ? (
                  <div className="text-center py-20 bg-cream-50 rounded-[2rem] border border-dashed border-cream-300">
                    <FiMessageSquare size={48} className="mx-auto mb-4 text-cream-400" />
                    <h3 className="text-xl font-bold text-ink mb-2">No reviews yet</h3>
                    <p className="text-ink-muted">Be the first to share your thoughts on this style.</p>
                  </div>
                ) : (
                  reviews.map((review, idx) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white p-8 rounded-[2rem] border border-cream-200 hover:border-rose-brand/30 hover:shadow-xl hover:shadow-cream-200 transition-all duration-500"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-cream-100 rounded-full overflow-hidden flex items-center justify-center border border-cream-200 ring-2 ring-white ring-offset-2 ring-offset-cream-100 shadow-sm">
                            {review.user?.avatar?.url ? (
                              <img src={review.user.avatar.url} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="text-lg font-bold text-ink-muted">{review.user?.name?.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-ink text-lg">{review.user?.name || 'Aivana Member'}</h4>
                            <div className="flex items-center gap-3 mt-0.5">
                              <p className="text-[10px] text-ink-muted uppercase tracking-[0.15em] font-bold">
                                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                              {review.verified && (
                                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-[9px] font-bold border border-green-100 uppercase tracking-wider">
                                  <FiCheckCircle size={10} /> Verified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 text-yellow-500 bg-yellow-50/50 px-3 py-1.5 rounded-full border border-yellow-100/50 shadow-sm self-start sm:self-center">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <FiStar key={s} className={s <= review.rating ? 'fill-yellow-500' : 'text-cream-300'} size={12} />
                          ))}
                        </div>
                      </div>

                      <h5 className="text-xl font-bold text-ink mb-3 font-display">{review.title}</h5>
                      <p className="text-ink-light leading-relaxed mb-8 italic text-lg opacity-90">"{review.comment}"</p>

                      <div className="flex items-center justify-between pt-6 border-t border-cream-100/60">
                        <div className="flex items-center gap-6">
                          <button 
                            onClick={async () => {
                              try {
                                await axiosInstance.post(`/reviews/${review._id}/helpful`);
                                queryClient.invalidateQueries(['reviews', productId]);
                                toast.success('Thanks for your feedback!', { icon: '👏' });
                              } catch (err) {
                                toast.error('Already voted');
                              }
                            }}
                            className="flex items-center gap-2 text-xs font-bold text-ink-muted hover:text-rose-brand transition-all group/btn bg-cream-50/50 px-4 py-2 rounded-full border border-cream-100 hover:border-rose-brand/30 hover:bg-rose-50"
                          >
                            <FiThumbsUp size={14} className="group-hover/btn:scale-110 group-hover/btn:-rotate-12 transition-transform" />
                            <span>Found this helpful ({review.helpful || 0})</span>
                          </button>
                          <button className="flex items-center gap-2 text-xs font-bold text-ink-muted hover:text-ink transition-colors px-4 py-2 rounded-full hover:bg-cream-100">
                            <FiMessageSquare size={14} />
                            <span>Reply</span>
                          </button>
                        </div>
                        
                        <div className="hidden sm:block">
                          <div className="flex -space-x-2">
                             {[1,2,3].map(i => (
                               <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-cream-200 overflow-hidden">
                                 <img src={`https://i.pravatar.cc/100?u=${review._id}${i}`} alt="user" className="w-full h-full object-cover opacity-60" />
                               </div>
                             ))}
                             <div className="w-6 h-6 rounded-full border-2 border-white bg-cream-100 flex items-center justify-center text-[8px] font-bold text-ink-muted">
                               +{Math.floor(Math.random() * 20)}
                             </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

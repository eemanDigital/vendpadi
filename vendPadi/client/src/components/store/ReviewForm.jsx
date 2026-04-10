import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import RatingStars from '../ui/RatingStars';
import { productAPI } from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const ReviewForm = ({ productId, vendorId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setSubmitting(true);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('vendpadi_token')}`
        },
        body: JSON.stringify({
          productId,
          vendorId,
          rating,
          customerName: name.trim(),
          comment: comment.trim()
        })
      });
      
      toast.success('Review submitted!');
      setRating(0);
      setName('');
      setComment('');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <RatingStars
          rating={rating}
          interactive
          onChange={setRating}
          size={24}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={3}
          className="input-field resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <FiSend size={16} />
            Submit Review
          </>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;

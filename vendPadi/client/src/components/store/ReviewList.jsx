import RatingStars, { RatingSummary } from '../ui/RatingStars';

const ReviewCard = ({ review }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h4 className="font-medium text-navy">{review.customerName}</h4>
          <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
        </div>
        <RatingStars rating={review.rating} size={14} />
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
};

const ReviewList = ({ reviews = [], className = '' }) => {
  if (reviews.length === 0) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4 pb-3 border-b">
        <RatingSummary rating={averageRating} count={reviews.length} />
      </div>
      
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
};

export { ReviewCard, ReviewList };
export default ReviewList;

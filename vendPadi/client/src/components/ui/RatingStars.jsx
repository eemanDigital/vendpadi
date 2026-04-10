import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const RatingStars = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 16, 
  interactive = false,
  onChange,
  showValue = false,
  className = '' 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const displayRating = hoverRating || rating;
  
  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };
  
  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };
  
  const handleMouseLeave = () => {
    setHoverRating(0);
  };
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, i) => {
        const value = i + 1;
        const isFilled = value <= displayRating;
        
        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <FiStar
              size={size}
              className={`transition-colors ${
                isFilled 
                  ? 'fill-amber-400 text-amber-400' 
                  : 'fill-transparent text-gray-300'
              }`}
            />
          </button>
        );
      })}
      {showValue && rating > 0 && (
        <span className="ml-1 text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

const RatingSummary = ({ rating, count, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm';
  
  return (
    <div className={`flex items-center gap-2 ${sizeClasses}`}>
      <RatingStars rating={rating} size={size === 'sm' ? 12 : 14} />
      <span className="text-gray-500">
        {rating > 0 ? rating.toFixed(1) : 'No'} ({count || 0})
      </span>
    </div>
  );
};

export { RatingStars, RatingSummary };
export default RatingStars;

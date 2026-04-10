import { useSelector, useDispatch } from 'react-redux';
import { FiHeart } from 'react-icons/fi';
import { toggleWishlist, selectIsInWishlist } from '../../store/wishlistSlice';

const WishlistButton = ({ product, size = 'md', showCount = false }) => {
  const dispatch = useDispatch();
  const isInWishlist = useSelector(selectIsInWishlist(product._id));

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 22
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]} 
        rounded-full flex items-center justify-center 
        transition-all duration-300
        ${isInWishlist 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'
        }
        shadow-md hover:shadow-lg
      `}
    >
      <FiHeart 
        size={iconSizes[size]} 
        className={isInWishlist ? 'fill-current' : ''} 
      />
    </button>
  );
};

export default WishlistButton;

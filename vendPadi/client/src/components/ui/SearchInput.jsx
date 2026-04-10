import { FiSearch, FiX } from 'react-icons/fi';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className = '',
  debounceMs = 300 
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-padi-green/20 focus:border-padi-green transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

import { FiChevronDown } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'stock_low', label: 'Stock: Low to High' },
  { value: 'stock_high', label: 'Stock: High to Low' }
];

const SortDropdown = ({ value, onChange, className = '' }) => {
  return (
    <div className={`relative ${className}`} style={{ minWidth: '160px' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-padi-green/20 focus:border-padi-green transition-all cursor-pointer hover:border-gray-300"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
    </div>
  );
};

export { SORT_OPTIONS };
export default SortDropdown;

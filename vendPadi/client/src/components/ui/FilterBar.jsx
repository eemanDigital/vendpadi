import { FiFilter } from 'react-icons/fi';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'food', label: 'Food & Drinks', emoji: '🍔' },
  { value: 'fashion', label: 'Fashion & Clothing', emoji: '👗' },
  { value: 'phones', label: 'Phones & Gadgets', emoji: '📱' },
  { value: 'beauty', label: 'Beauty & Skincare', emoji: '💄' },
  { value: 'cakes', label: 'Cakes & Pastries', emoji: '🎂' },
  { value: 'electronics', label: 'Electronics & Appliances', emoji: '📺' },
  { value: 'home', label: 'Home & Living', emoji: '🏠' },
  { value: 'sports', label: 'Sports & Fitness', emoji: '⚽' },
  { value: 'books', label: 'Books & Stationery', emoji: '📚' },
  { value: 'toys', label: 'Toys & Games', emoji: '🎮' },
  { value: 'services', label: 'Services', emoji: '🛠️' },
  { value: 'other', label: 'Other', emoji: '🏪' }
];

const getCategoryLabel = (value) => {
  const cat = CATEGORIES.find(c => c.value === value);
  return cat ? cat.label : value;
};

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  showPriceFilter = true,
  showStockFilter = true,
  className = '' 
}) => {
  const hasActiveFilters = filters.category || filters.inStock !== undefined || filters.lowStock;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <FiFilter size={16} />
        <span>Filter:</span>
      </div>
      
      <select
        value={filters.category || ''}
        onChange={(e) => onFilterChange('category', e.target.value)}
        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-padi-green/20 focus:border-padi-green cursor-pointer"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      {showStockFilter && (
        <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm cursor-pointer hover:border-gray-300 transition-colors">
          <input
            type="checkbox"
            checked={filters.inStock === true}
            onChange={(e) => onFilterChange('inStock', e.target.checked ? true : undefined)}
            className="w-4 h-4 text-padi-green rounded"
          />
          <span>In Stock</span>
        </label>
      )}

      {showPriceFilter && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="w-20 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-padi-green/20 focus:border-padi-green"
            min="0"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="w-20 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-padi-green/20 focus:border-padi-green"
            min="0"
          />
        </div>
      )}

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export { CATEGORIES, getCategoryLabel };
export default FilterBar;

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  
  const { page, totalPages, total } = pagination;
  
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100">
      <div className="text-sm text-gray-500">
        Showing {(page - 1) * 20 + 1} - {Math.min(page * 20, total)} of {total}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <FiChevronLeft size={16} />
          <span className="hidden sm:inline">Prev</span>
        </button>
        <span className="text-sm font-medium px-3">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
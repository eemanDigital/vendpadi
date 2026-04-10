const StoreSkeleton = () => (
  <div className="min-h-screen bg-[#F8F9FB]">
    <div className="h-14 bg-white border-b border-gray-100" />
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-3 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-1/2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default StoreSkeleton;

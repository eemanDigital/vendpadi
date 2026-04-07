import { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../store/cartSlice";
import {
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
} from "react-icons/fi";

const CategoryIcon = ({ category }) => {
  const icons = {
    food: "🍔",
    fashion: "👗",
    phones: "📱",
    cakes: "🎂",
    other: "📦",
  };
  return <span className="text-4xl">{icons[category] || icons.other}</span>;
};

const ProductCard = ({ product, onOpenDetail }) => {
  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addItem(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const hasMultipleImages = product.images && product.images.length > 1;

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  return (
    <div
      className="card overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onOpenDetail?.(product)}>
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <>
            <img
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                  <FiChevronLeft className="text-gray-700 text-sm" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                  <FiChevronRight className="text-gray-700 text-sm" />
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImage(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentImage
                          ? "w-4 bg-padi-green"
                          : "w-1.5 bg-white/70 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <CategoryIcon category={product.category} />
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="font-sora font-semibold text-navy text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="font-bold text-padi-green text-base whitespace-nowrap">
            ₦{product.price.toLocaleString()}
          </span>
          {product.inStock && (
            <button
              onClick={handleAddToCart}
              className={`p-2 rounded-xl transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-padi-green hover:bg-padi-green-dark text-white shadow-md hover:shadow-lg"
              }`}>
              {added ? (
                <FiCheck className="text-sm" />
              ) : (
                <FiShoppingCart className="text-sm" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

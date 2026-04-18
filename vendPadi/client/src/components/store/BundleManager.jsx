import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { bundleAPI } from "../../api/axiosInstance";
import toast from "react-hot-toast";
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiGift,
  FiZap,
  FiCheck,
  FiLock,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const BundleManager = ({ products, onUpgradeClick }) => {
  const { vendor } = useSelector((state) => state.auth);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);

  const isOnTrial = vendor?.trial?.active === true;
  const trialPlan = vendor?.trial?.plan || "premium";
  const effectivePlan = isOnTrial ? trialPlan : vendor?.plan?.type || "free";
  const canCreateBundles = effectivePlan === "premium";

  useEffect(() => {
    if (canCreateBundles) {
      fetchBundles();
    } else {
      setLoading(false);
    }
  }, [canCreateBundles]);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const { data } = await bundleAPI.getAll();
      setBundles(data.bundles || []);
    } catch {
      console.error("Failed to fetch bundles");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBundle = async (bundleData) => {
    try {
      const { data } = await bundleAPI.create(bundleData);
      setBundles((prev) => [data.bundle, ...prev]);
      toast.success("Bundle created!");
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create bundle");
    }
  };

  const handleDeleteBundle = async (bundleId) => {
    if (!confirm("Delete this bundle?")) return;
    try {
      await bundleAPI.delete(bundleId);
      setBundles((prev) => prev.filter((b) => b._id !== bundleId));
      toast.success("Bundle deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete bundle");
    }
  };

  const handleToggleDeal = async (bundle) => {
    try {
      const { data } = await bundleAPI.update(bundle._id, {
        isDealOfTheDay: !bundle.isDealOfTheDay,
      });
      setBundles((prev) =>
        prev.map((b) => (b._id === bundle._id ? data.bundle : b)),
      );
      toast.success(
        bundle.isDealOfTheDay ? "Deal removed" : "Now a Deal of the Day!",
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update bundle");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${canCreateBundles ? "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/20" : "bg-gray-100"}`}>
            <FiGift
              className={canCreateBundles ? "text-white" : "text-gray-400"}
            />
          </div>
          <div>
            <h3 className="font-sora font-semibold text-navy">
              Product Bundles
            </h3>
            <p className="text-xs text-gray-500">
              Create deals with multiple products
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : bundles.length === 0 ? (
        <div className="text-center py-8">
          <FiGift className="text-gray-300 text-4xl mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No bundles yet</p>
          <p className="text-gray-400 text-xs mt-1">
            Create a bundle to boost your average order value
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {bundles.map((bundle) => (
            <div key={bundle._id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-navy truncate">
                      {bundle.name}
                    </h4>
                    {bundle.isDealActive && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full shrink-0">
                        <FiZap size={10} /> DEAL
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {bundle.products?.length || 0} products
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <p className="font-bold text-padi-green text-lg">
                  ₦{bundle.bundlePrice?.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400 line-through">
                    ₦{bundle.originalPrice?.toLocaleString()}
                  </p>
                  {bundle.discountPercentage > 0 && (
                    <span className="text-xs text-red-500 font-medium">
                      -{bundle.discountPercentage}%
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => handleToggleDeal(bundle)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    bundle.isDealOfTheDay
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}>
                  <FiZap size={12} />
                  {bundle.isDealOfTheDay ? "Deal On" : "Set Deal"}
                </button>
                <button
                  onClick={() => handleDeleteBundle(bundle._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {canCreateBundles ? (
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-padi-green text-white px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-padi-green-dark transition-colors w-full sm:w-auto">
          <FiPlus size={16} /> New Bundle
        </button>
      ) : (
        <button
          onClick={onUpgradeClick}
          className="flex items-center justify-center gap-2 bg-purple-100 text-purple-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-200 transition-colors w-full sm:w-auto">
          <FiLock size={14} /> Unlock
        </button>
      )}

      <AnimatePresence>
        {showModal && (
          <BundleModal
            products={products}
            onClose={() => setShowModal(false)}
            onSubmit={handleCreateBundle}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const BundleModal = ({ products, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bundlePrice, setBundlePrice] = useState("");
  const [isDealOfTheDay, setIsDealOfTheDay] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const originalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const savings = originalPrice - (Number(bundlePrice) || 0);
  const discountPct =
    originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  const toggleProduct = (product) => {
    setSelectedProducts((prev) =>
      prev.find((p) => p._id === product._id)
        ? prev.filter((p) => p._id !== product._id)
        : [...prev, product],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Bundle name is required");
      return;
    }
    if (selectedProducts.length < 2) {
      toast.error("Select at least 2 products");
      return;
    }
    if (!bundlePrice || Number(bundlePrice) <= 0) {
      toast.error("Enter a bundle price");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        productIds: selectedProducts.map((p) => p._id),
        bundlePrice: Number(bundlePrice),
        isDealOfTheDay,
        dealEndTime: isDealOfTheDay
          ? new Date(Date.now() + 24 * 60 * 60 * 1000)
          : null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-sora font-bold text-lg text-navy">
            Create Bundle
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-padi-green hover:bg-gray-100 rounded-lg transition-colors">
            <FiX size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bundle Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g., Complete Package"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
              rows={2}
              placeholder="Optional description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Products * (min 2)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-2">
              {products.map((product) => (
                <label
                  key={product._id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedProducts.find((p) => p._id === product._id)
                      ? "bg-padi-green/10 border border-padi-green"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}>
                  <input
                    type="checkbox"
                    checked={
                      !!selectedProducts.find((p) => p._id === product._id)
                    }
                    onChange={() => toggleProduct(product)}
                    className="w-4 h-4 text-padi-green rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-navy truncate">
                      {product.name}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-padi-green">
                    ₦{product.price.toLocaleString()}
                  </span>
                </label>
              ))}
            </div>
            {selectedProducts.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Total original price: ₦{originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bundle Price (₦) *
              </label>
              <input
                type="number"
                value={bundlePrice}
                onChange={(e) => setBundlePrice(e.target.value)}
                className="input-field"
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div className="flex items-end">
              <div
                className={`flex-1 p-3 rounded-xl text-center ${discountPct > 0 ? "bg-green-50" : "bg-gray-50"}`}>
                <p
                  className={`text-lg font-bold ${discountPct > 0 ? "text-green-600" : "text-gray-400"}`}>
                  {discountPct > 0 ? `${discountPct}% OFF` : "No discount"}
                </p>
                {savings > 0 && (
                  <p className="text-xs text-gray-500">
                    Save ₦{savings.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 p-3 bg-red-50 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={isDealOfTheDay}
              onChange={(e) => setIsDealOfTheDay(e.target.checked)}
              className="w-4 h-4 text-red-500 rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-sm text-red-800">
                Deal of the Day
              </p>
              <p className="text-xs text-red-600">
                Featured prominently on your store
              </p>
            </div>
            <FiZap className="text-red-500" />
          </label>
        </form>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border bg-padi-green border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || selectedProducts.length < 2}
            className="flex-1 py-3 bg-padi-green text-white rounded-xl font-medium hover:bg-padi-green-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <FiCheck /> Create Bundle
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BundleManager;

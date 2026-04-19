import { FiZap, FiSmartphone } from "react-icons/fi";

const SetupServiceSection = () => {
  return (
    <section className="py-12 px-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
          <FiZap size={14} /> CONVERSION FOCUS
        </div>
        <h3 className="font-sora font-bold text-2xl mb-3 text-navy">
          Don't want to set it up yourself?
        </h3>
        <p className="text-gray-600 mb-4">
          We'll create your store for you in 24 hours.
        </p>
        <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-lg mb-6">
          <span className="text-3xl font-bold text-amber-600">₦5,000</span>
          <span className="text-gray-500 text-sm">one-time</span>
        </div>
        <br />
        <a
          href="mailto:support@vendpadi.com?subject=Store Setup Service"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <FiSmartphone size={18} />
          Request Setup Service
        </a>
      </div>
    </section>
  );
};

export default SetupServiceSection;
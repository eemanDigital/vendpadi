import { motion } from 'framer-motion';

const AnalyticsCard = ({ title, value, subtitle, icon: Icon, trend, color = 'green' }) => {
  const colorClasses = {
    green: 'bg-padi-green/10 text-padi-green',
    blue: 'bg-blue-500/10 text-blue-500',
    gold: 'bg-gold/10 text-gold',
    purple: 'bg-purple-500/10 text-purple-500',
    red: 'bg-red-500/10 text-red-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between mb-1.5 sm:mb-2">
        <div className={`p-1.5 sm:p-2 rounded-lg ${colorClasses[color]}`}>
          {Icon && <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />}
        </div>
        {trend !== undefined && (
          <span className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
            trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-1.5 sm:mt-2">
        <p className="text-lg sm:text-2xl font-bold text-navy font-sora">{value}</p>
        <p className="text-xs sm:text-sm font-medium text-gray-700 mt-0.5 sm:mt-1">{title}</p>
        {subtitle && <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;

import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiAward } from 'react-icons/fi';

const GrowthInsights = ({ topProduct, viewsCount, whatsappClicks, conversionRate }) => {
  const messages = [];
  
  if (viewsCount > 0) {
    messages.push({
      icon: FiTrendingUp,
      text: 'Your store is getting attention',
      color: 'text-green-600',
      bg: 'bg-green-50'
    });
  }

  if (whatsappClicks > 0) {
    messages.push({
      icon: FiTrendingUp,
      text: `You received ${whatsappClicks} order request${whatsappClicks > 1 ? 's' : ''}!`,
      color: 'text-padi-green',
      bg: 'bg-padi-green/10'
    });
  }

  if (conversionRate > 10) {
    messages.push({
      icon: FiAward,
      text: `Great! ${conversionRate}% of visitors are ordering`,
      color: 'text-gold',
      bg: 'bg-gold/10'
    });
  }

  if (viewsCount === 0 && whatsappClicks === 0) {
    messages.push({
      icon: FiTrendingUp,
      text: 'Share your store to start getting orders',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    });
  }

  if (messages.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-padi-green/5 to-gold/5 rounded-xl p-3 sm:p-4 border border-padi-green/20"
    >
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <span className="text-base sm:text-lg">💡</span>
        <h3 className="font-sora font-semibold text-navy text-xs sm:text-sm">Growth Insights</h3>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 ${msg.bg} p-1.5 sm:p-2 rounded-lg`}
          >
            <msg.icon className={`${msg.color} w-3.5 h-3.5 sm:w-4 sm:h-4`} />
            <span className={`text-xs sm:text-sm font-medium ${msg.color}`}>{msg.text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GrowthInsights;

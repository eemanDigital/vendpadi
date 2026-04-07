import { Link } from 'react-router-dom';
import { FiTrendingUp, FiShare2, FiMessageCircle, FiCheck, FiStar } from 'react-icons/fi';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-navy text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-padi-green rounded-lg flex items-center justify-center">
              <span className="font-sora font-bold text-lg">V</span>
            </div>
            <span className="font-sora font-bold text-xl">VendPadi</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-padi-green transition-colors">Login</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <FiMessageCircle className="text-padi-green" />
            <span className="text-sm">Built for Nigerian businesses</span>
          </div>
          <h1 className="font-sora font-bold text-4xl md:text-6xl mb-6 leading-tight">
            Your Products.<br />
            <span className="text-padi-green">One Link.</span><br />
            Orders on WhatsApp.
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Create your online store in minutes. Share your link on WhatsApp, Instagram, or anywhere. 
            Customers order with a single tap — no app downloads needed.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-padi-green hover:bg-padi-green-dark text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all">
            <FiStar />
            Create Your Free Store
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sora font-bold text-3xl text-center mb-4">How It Works</h2>
          <p className="text-gray-500 text-center mb-12">Three simple steps to start selling</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: FiCheck, title: 'Register Your Store', desc: 'Sign up in 30 seconds. Get a unique link like vendpadi.com/store/yourname' },
              { step: '2', icon: FiTrendingUp, title: 'Add Your Products', desc: 'Upload photos, set prices, add descriptions. Your catalog is ready instantly.' },
              { step: '3', icon: FiShare2, title: 'Share & Get Orders', desc: 'Share your link on WhatsApp. Customers tap to order — it opens WhatsApp with their order ready.' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm text-center">
                <div className="w-12 h-12 bg-padi-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-padi-green text-2xl" />
                </div>
                <span className="text-padi-green font-bold text-sm">Step {item.step}</span>
                <h3 className="font-sora font-semibold text-xl mt-2 mb-3">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-sora font-bold text-3xl text-center mb-4">Simple Pricing</h2>
          <p className="text-gray-500 text-center mb-12">Start free, upgrade when you grow</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                plan: 'Free', 
                price: '₦0', 
                period: 'forever',
                features: ['5 products', '1 image per product', 'WhatsApp orders', 'Shareable store link'],
                cta: 'Get Started',
                highlight: false
              },
              { 
                plan: 'Basic', 
                price: '₦1,500', 
                period: '/month',
                features: ['20 products', '3 images per product', 'Logo upload', 'WhatsApp orders', 'Shareable store link'],
                cta: 'Upgrade to Basic',
                highlight: true
              },
              { 
                plan: 'Premium', 
                price: '₦3,000', 
                period: '/month',
                features: ['Unlimited products', '3 images per product', 'Logo upload', 'WhatsApp orders', 'Shareable store link', 'Priority support'],
                cta: 'Go Premium',
                highlight: false,
                badge: '👑'
              }
            ].map((item, i) => (
              <div key={i} className={`p-8 rounded-2xl ${item.highlight ? 'bg-navy text-white ring-4 ring-padi-green' : 'bg-white border border-gray-200'}`}>
                {item.badge && <span className="text-2xl">{item.badge}</span>}
                <h3 className="font-sora font-semibold text-xl mt-2">{item.plan}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">{item.price}</span>
                  <span className={`text-sm ${item.highlight ? 'text-gray-300' : 'text-gray-500'}`}>{item.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <FiCheck className={item.highlight ? 'text-padi-green' : 'text-padi-green'} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register" 
                  className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all ${
                    item.highlight 
                      ? 'bg-padi-green text-white hover:bg-padi-green-dark' 
                      : 'bg-navy text-white hover:bg-navy-light'
                  }`}
                >
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-padi-green text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-sora font-bold text-3xl mb-4">Ready to Start Selling?</h2>
          <p className="text-white/80 mb-8">Join thousands of Nigerian vendors already using VendPadi to grow their business.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-padi-green font-bold py-4 px-8 rounded-2xl text-lg hover:bg-gray-100 transition-all">
            Create Your Store Now — It's Free!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-padi-green rounded-lg flex items-center justify-center">
              <span className="font-sora font-bold text-lg text-white">V</span>
            </div>
            <span className="font-sora font-bold text-xl text-white">VendPadi</span>
          </div>
          <p className="text-sm">© 2024 VendPadi. Made with ❤️ in Nigeria.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

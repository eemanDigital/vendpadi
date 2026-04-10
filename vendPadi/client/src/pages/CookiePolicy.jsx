import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <FiArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-padi-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-sora font-bold text-navy">Cookie Policy</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <h1 className="font-sora font-bold text-2xl sm:text-3xl text-navy mb-6">Cookie Policy</h1>
          
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files stored on your device (computer, phone, tablet) when you visit a website. They help websites remember your preferences, login status, and provide a better browsing experience.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                VendPadi uses cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Authentication:</strong> To keep you logged in while using our platform</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Analytics:</strong> To understand how visitors use our platform</li>
                <li><strong>Security:</strong> To detect unauthorized access and protect your account</li>
              </ul>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">3. Types of Cookies We Use</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-navy mb-2">Essential Cookies</h3>
                  <p className="text-gray-600 text-sm">
                    Required for the website to function. They enable core features like security, login, and session management. These cannot be disabled as the site would not work properly without them.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-navy mb-2">Functionality Cookies</h3>
                  <p className="text-gray-600 text-sm">
                    Remember your preferences and settings (like language, theme, and layout choices) to provide a personalized experience.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-navy mb-2">Analytics Cookies</h3>
                  <p className="text-gray-600 text-sm">
                    Help us understand how visitors interact with our website by collecting anonymous information about pages visited, time spent, and error messages encountered.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-navy mb-2">Marketing Cookies</h3>
                  <p className="text-gray-600 text-sm">
                    We currently do not use marketing cookies. If we implement them in the future, we will update this policy and obtain your consent.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Some cookies are placed by third-party services that appear on our pages:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Cloudinary:</strong> For image upload and storage functionality</li>
                <li><strong>Resend:</strong> For email delivery services</li>
                <li><strong>Browser Analytics:</strong> For understanding site usage patterns</li>
              </ul>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">5. How Long Do Cookies Last?</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Cookies can be either:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Most of our cookies are session cookies that expire when you close your browser. Authentication cookies may persist for 30 days for your convenience.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">6. Managing Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies through settings</li>
                <li><strong>Private/Incognito Mode:</strong> Browsing in private mode prevents cookie storage</li>
                <li><strong>Browser Extensions:</strong> Some extensions can manage cookies across sites</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Note: Blocking essential cookies may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">7. Cookie Consent</h2>
              <p className="text-gray-600 leading-relaxed">
                By using VendPadi, you consent to the use of essential and functionality cookies as described in this policy. For any future cookie types requiring consent, we will request your permission before placing them.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">8. Updates to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Cookie Policy periodically to reflect changes in our practices or for legal reasons. Please review this page regularly to stay informed about our use of cookies.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">9. Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                For questions about our use of cookies, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-700"><strong>VendPadi</strong></p>
                <p className="text-gray-600">Email: support@vendpadi.com</p>
                <p className="text-gray-600">Nigeria</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CookiePolicy;

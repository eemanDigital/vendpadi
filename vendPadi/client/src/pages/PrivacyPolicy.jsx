import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiCheck } from 'react-icons/fi';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <FiArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div className="flex items-center gap-2">
            <FiShield className="text-padi-green" />
            <span className="font-sora font-bold text-navy">Privacy Policy</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <h1 className="font-sora font-bold text-2xl sm:text-3xl text-navy mb-6">Privacy Policy</h1>
          
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                VendPadi ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this privacy policy carefully. By using VendPadi, you consent to the practices described in this policy.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-4">We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Account Information:</strong> Business name, email address, phone number, password (encrypted)</li>
                <li><strong>Store Information:</strong> Logo, description, category, WhatsApp number</li>
                <li><strong>Product Information:</strong> Product names, descriptions, prices, images</li>
                <li><strong>Order Information:</strong> Customer names, phone numbers, order details</li>
                <li><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent</li>
              </ul>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Create and manage your account</li>
                <li>Display your online store to customers</li>
                <li>Process and fulfill orders through WhatsApp</li>
                <li>Send order notifications via email</li>
                <li>Improve our services and user experience</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">4. Information Sharing</h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-4">
                <li><strong>Service Providers:</strong> Cloud storage (Cloudinary), email service (Resend)</li>
                <li><strong>Order Fulfillment:</strong> WhatsApp to deliver orders to vendors</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">5. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate security measures including encryption, secure servers, and access controls. However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">6. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your data for as long as your account is active or as needed to provide services. You may delete your account and associated data by contacting us. We may retain certain information for legal, tax, or regulatory compliance purposes.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">7. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">8. Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies to maintain your login session and remember your preferences. For detailed information about our cookie usage, please see our <Link to="/cookie-policy" className="text-padi-green hover:underline">Cookie Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">9. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                VendPadi is not intended for users under the age of 18. We do not knowingly collect data from minors. If we become aware that we have collected data from a minor, we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">11. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us:
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

export default PrivacyPolicy;

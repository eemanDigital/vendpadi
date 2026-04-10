import { Link } from 'react-router-dom';
import { FiArrowLeft, FiFileText } from 'react-icons/fi';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <FiArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div className="flex items-center gap-2">
            <FiFileText className="text-padi-green" />
            <span className="font-sora font-bold text-navy">Terms of Service</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <h1 className="font-sora font-bold text-2xl sm:text-3xl text-navy mb-6">Terms of Service</h1>
          
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using VendPadi's services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use our services. These Terms constitute a legally binding agreement between you and VendPadi.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">2. Description of Service</h2>
              <p className="text-gray-600 leading-relaxed">
                VendPadi provides an online store builder that allows vendors to create digital storefronts, list products, and receive orders via WhatsApp. Our platform facilitates the connection between vendors and customers but does not participate in the actual sale, delivery, or payment of products.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">3. Account Registration</h2>
              <p className="text-gray-600 leading-relaxed mb-4">To use VendPadi, you must:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">4. Vendor Responsibilities</h2>
              <p className="text-gray-600 leading-relaxed mb-4">As a vendor on VendPadi, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>List only products you are authorized to sell</li>
                <li>Provide accurate product descriptions, prices, and images</li>
                <li>Honor all orders placed through your store</li>
                <li>Respond promptly to customer inquiries via WhatsApp</li>
                <li>Comply with all applicable Nigerian laws and regulations</li>
                <li>Not engage in fraudulent, illegal, or deceptive practices</li>
                <li>Maintain adequate stock of listed products</li>
                <li>Set fair and competitive prices</li>
              </ul>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">5. Prohibited Activities</h2>
              <p className="text-gray-600 leading-relaxed mb-4">You may not use VendPadi to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Sell illegal, prohibited, or restricted items</li>
                <li>Engage in fraudulent transactions</li>
                <li>Upload malicious code or viruses</li>
                <li>Harvest user data without consent</li>
                <li>Impersonate any person or entity</li>
                <li>Spam or send unsolicited messages</li>
                <li>Violate any intellectual property rights</li>
                <li>circumvent any security measures</li>
              </ul>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">6. Product Listings & Orders</h2>
              <p className="text-gray-600 leading-relaxed">
                VendPadi facilitates orders between vendors and customers via WhatsApp. Orders placed through your store are subject to your own policies regarding fulfillment, returns, and refunds. We recommend clearly stating your policies to customers.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">7. Subscription & Fees</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                VendPadi offers both free and paid subscription plans. Paid plans are billed monthly via bank transfer as specified in your plan. All fees are non-refundable unless otherwise stated.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to change our pricing with 30 days notice.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">8. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                VendPadi retains all rights to our platform, branding, and technology. You retain rights to your store content, product listings, and branding you provide. You grant us a license to display your content on our platform.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-gray-600 leading-relaxed">
                VendPadi is provided "as is" and "as available" without warranties of any kind. We do not guarantee that our services will be uninterrupted, secure, or error-free. We are not responsible for the actions, products, or content of vendors or customers.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                To the maximum extent permitted by law, VendPadi shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount you paid us in the past 12 months.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">11. Indemnification</h2>
              <p className="text-gray-600 leading-relaxed">
                You agree to indemnify and hold harmless VendPadi, its officers, directors, and employees from any claims, damages, losses, or expenses arising from your use of our services, your violation of these Terms, or your violation of any rights of a third party.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">12. Account Termination</h2>
              <p className="text-gray-600 leading-relaxed">
                We may suspend or terminate your account if you violate these Terms, engage in illegal activity, or for any other reason at our discretion. Upon termination, your right to use our services ceases immediately.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">13. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of Nigerian courts.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">14. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We may modify these Terms at any time. We will notify you of significant changes via email or our platform. Your continued use of VendPadi after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="font-sora font-bold text-xl text-navy mb-4">15. Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                For questions about these Terms, please contact us:
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

export default TermsOfService;

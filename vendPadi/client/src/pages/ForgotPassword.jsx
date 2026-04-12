import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/axiosInstance";
import toast from "react-hot-toast";
import { FiMail, FiArrowLeft, FiCheck } from "react-icons/fi";
import Logo from "../components/Logo";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy to-navy-light flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-padi-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck size={40} className="text-padi-green" />
            </div>
            <h1 className="font-sora font-bold text-2xl text-navy mb-3">
              Check Your Email
            </h1>
            <p className="text-gray-500 mb-6">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and spam folder.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              The link expires in 30 minutes.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-navy hover:bg-navy/90 text-white py-4 rounded-2xl font-semibold transition-all">
              Back to Login
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="w-full mt-3 text-gray-500 hover:text-navy py-2 font-medium transition-colors">
              Try different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-navy-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
          <FiArrowLeft size={18} />
          Back to Login
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo variant="icon" size="lg" showText />
            </div>
            <div className="w-16 h-16 bg-padi-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiMail size={28} className="text-padi-green" />
            </div>
            <h1 className="font-sora font-bold text-2xl text-navy mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-navy placeholder-gray-400 focus:outline-none focus:border-padi-green focus:ring-2 focus:ring-padi-green/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-padi-green hover:bg-padi-green/90 disabled:bg-padi-green/50 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{" "}
            <Link to="/login" className="text-padi-green font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

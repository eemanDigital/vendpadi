import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { authAPI } from "../api/axiosInstance";
import toast from "react-hot-toast";
import { FiLock, FiArrowLeft, FiCheck, FiAlertCircle } from "react-icons/fi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new one.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy to-navy-light flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-padi-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck size={40} className="text-padi-green" />
            </div>
            <h1 className="font-sora font-bold text-2xl text-navy mb-3">
              Password Reset!
            </h1>
            <p className="text-gray-500 mb-6">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-padi-green hover:bg-padi-green/90 text-white py-4 rounded-2xl font-bold transition-all">
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy to-navy-light flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiAlertCircle size={40} className="text-red-500" />
            </div>
            <h1 className="font-sora font-bold text-2xl text-navy mb-3">
              Invalid Link
            </h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link
              to="/forgot-password"
              className="inline-block w-full bg-navy hover:bg-navy/90 text-white py-4 rounded-2xl font-bold transition-all">
              Request New Link
            </Link>
            <Link
              to="/login"
              className="block mt-4 text-gray-500 hover:text-navy font-medium">
              Back to Login
            </Link>
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
            <div className="w-16 h-16 bg-padi-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiLock size={28} className="text-padi-green" />
            </div>
            <h1 className="font-sora font-bold text-2xl text-navy mb-2">
              Set New Password
            </h1>
            <p className="text-gray-500 text-sm">
              Create a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <FiAlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-navy placeholder-gray-400 focus:outline-none focus:border-padi-green focus:ring-2 focus:ring-padi-green/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-navy placeholder-gray-400 focus:outline-none focus:border-padi-green focus:ring-2 focus:ring-padi-green/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-padi-green hover:bg-padi-green/90 disabled:bg-padi-green/50 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

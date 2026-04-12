import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import toast from "react-hot-toast";
import { FiShield, FiMail, FiLock } from "react-icons/fi";
import Logo from "../components/Logo";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const AUTH_API = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    secretCode: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AUTH_API.post("/admin/auth/login", formData);

      dispatch(
        setCredentials({
          token: response.data.token,
          vendor: response.data.admin,
        }),
      );
      localStorage.setItem("vendpadi_admin_token", response.data.token);
      toast.success("Welcome, Admin!");
      navigate("/admin-panel");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Logo variant="icon-light" size="lg" />
          </Link>
          <div className="mt-6 w-20 h-20 bg-padi-green/20 rounded-full flex items-center justify-center mx-auto">
            <FiShield className="text-padi-green text-4xl" />
          </div>
          <h1 className="font-sora font-bold text-2xl mt-4 text-white">
            Admin Portal
          </h1>
          <p className="text-gray-400 mt-2">Sign in to manage VendPadi</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-padi-green focus:ring-1 focus:ring-padi-green transition-colors"
                  placeholder="admin@vendpadi.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Secret Code
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  name="secretCode"
                  value={formData.secretCode}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-padi-green focus:ring-1 focus:ring-padi-green transition-colors"
                  placeholder="Enter secret code"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-padi-green hover:bg-padi-green-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <FiShield size={18} />
                Sign In as Admin
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          <Link
            to="/login"
            className="text-gray-400 hover:text-white transition-colors">
            Vendor Login
          </Link>
          <span className="mx-2">•</span>
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

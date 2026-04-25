import { useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { checkAuth } from './store/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';

const Landing = lazy(() => import('./pages/Landing'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Orders = lazy(() => import('./pages/Orders'));
const Storefront = lazy(() => import('./pages/Storefront'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const ManualInvoices = lazy(() => import('./pages/ManualInvoices'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Loading variant="spinner" size="lg" />
  </div>
);

function AppContent() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const authChecked = useRef(false);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    const token = localStorage.getItem('vendpadi_token');
    const adminToken = localStorage.getItem('vendpadi_admin_token');
    if (token || adminToken) {
      dispatch(checkAuth());
    } else {
      dispatch({ type: 'auth/setLoading', payload: false });
    }
  }, [dispatch]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A2E',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          },
          success: {
            iconTheme: {
              primary: '#25C866',
              secondary: '#fff',
            },
            style: {
              background: '#1A1A2E',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              background: '#1A1A2E',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Suspense fallback={<PageLoader />}><Landing /></Suspense>} />
        <Route path="/register" element={<Suspense fallback={<PageLoader />}><Register /></Suspense>} />
        <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
        <Route path="/admin-login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
        <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
        <Route path="/reset-password/:token" element={<Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>} />
        <Route path="/privacy-policy" element={<Suspense fallback={<PageLoader />}><PrivacyPolicy /></Suspense>} />
        <Route path="/terms-of-service" element={<Suspense fallback={<PageLoader />}><TermsOfService /></Suspense>} />
        <Route path="/cookie-policy" element={<Suspense fallback={<PageLoader />}><CookiePolicy /></Suspense>} />
        <Route path="/store/:slug" element={<Suspense fallback={<PageLoader />}><Storefront /></Suspense>} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}><Dashboard /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}><Settings /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}><Orders /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}><ManualInvoices /></Suspense>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin-panel"
          element={
            <AdminRoute>
              <Suspense fallback={<PageLoader />}><AdminPanel /></Suspense>
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={<Navigate to="/admin-panel" replace />}
        />
        </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;

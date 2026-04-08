import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { checkAuth } from './store/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Orders from './pages/Orders';
import Storefront from './pages/Storefront';
import AdminPanel from './pages/AdminPanel';

function AppContent() {
  const dispatch = useDispatch();
  const authChecked = useRef(false);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    const token = localStorage.getItem('vendpadi_token');
    if (token) {
      dispatch(checkAuth());
    } else {
      dispatch({ type: 'auth/setLoading', payload: false });
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1A1A2E',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#25C866',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/store/:slug" element={<Storefront />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;

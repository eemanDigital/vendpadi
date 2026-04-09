import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { vendor, isAuthenticated } = useSelector((state) => state.auth);
  const adminToken = localStorage.getItem('vendpadi_admin_token');

  if (!adminToken && !isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!vendor?.isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;

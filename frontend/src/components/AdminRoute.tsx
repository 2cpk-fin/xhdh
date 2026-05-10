import { Navigate, Outlet } from 'react-router-dom';
import { isAdmin } from '../utils/jwt-decode';

const AdminRoute = () => {
    return isAdmin() ? <Outlet /> : <Navigate to="/home" replace />;
};

export default AdminRoute;
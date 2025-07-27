import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth.jsx";
import useUserRole from "../hooks/useUserRole.jsx";


const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    const { role, isLoading } = useUserRole();
    const location = useLocation();

    if (isLoading) {
        return <p>Loading...</p>; // Or show spinner
    }

    if (!user || role !== 'admin') {
        return <Navigate to="/forbidden" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default AdminRoute;

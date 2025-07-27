import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../contexts/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user && user?.email) {
    return children;
  }

  return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
};

export default PrivateRoute;

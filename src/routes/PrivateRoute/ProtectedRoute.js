import { React, useEffect } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Store/AuthStore";
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated && location.pathname !== "/login") {
            <Navigate to="/login" replace />;
        }
    }, [isAuthenticated, location]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
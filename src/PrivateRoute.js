import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, isAuthenticated, requiredRole, userRole }) => {
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return Component;
};

export default PrivateRoute;

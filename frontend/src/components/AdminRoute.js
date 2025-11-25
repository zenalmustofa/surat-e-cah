import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    // Cek apakah ada token di localStorage
    const isAuthenticated = localStorage.getItem('token');

    // Jika ada token, izinkan akses (Outlet). Jika tidak, tendang ke Login.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
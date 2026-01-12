import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log("User in protected route")
    console.log(user)
  }, [user]);
  
  // If the user is authenticated, render child routes. Otherwise, redirect to login.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
// return <Outlet />;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

// Component that protects routes from unauthorized access
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { currentUser } = useAuth();

    // If no user is logged in, redirect to login page
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // If user is logged in but email is not verified, show message or redirect
    if (!currentUser.emailVerified) {
        return (
            <div style={{ 
                padding: '2rem', 
                textAlign: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <h2>Email Verification Required</h2>
                <p>Please verify your email address to access this page.</p>
                <p>Check your inbox for the verification link.</p>
            </div>
        );
    }

    // If user is authenticated and verified
    return <>{children}</>;
};

export default ProtectedRoute;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import Logo from '../components/Logo';
import Button from '../components/Button';
import './styles/AuthPages.css';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            // Sign in user with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if email is verified
            if (!user.emailVerified) {
                setError('Please verify your email before signing in. Check your inbox for the verification link.');
                setLoading(false);
                return;
            }

            // If successful and verified, redirect to dashboard or home
            navigate('/dashboard');

        } catch (err: any) {
            // Handle Firebase errors
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email. Please sign up first.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password. Please try again.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/user-disabled':
                    setError('This account has been disabled. Please contact support.');
                    break;
                case 'auth/network-request-failed':
                    setError('Network error. Please check your connection and try again.');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many failed login attempts. Please try again later.');
                    break;
                default:
                    setError('Failed to sign in. Please check your credentials and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Logo at top - clickable to return home */}
            <div className="auth-logo">
                <Logo size="large" onClick={() => navigate('/')} />
            </div>

            {/* Form Container */}
            <div className="auth-container">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to your Etown Exchange account</p>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <span>⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="auth-form">
                    {/* Email Input */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="yourname@etown.edu"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    {/* Optional: Remember Me and Forgot Password */}
                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        {/* TODO: Implement forgot password functionality later */}
                        {/* <Link to="/forgot-password" className="forgot-password">Forgot password?</Link> */}
                    </div>

                    {/* Submit Button */}
                    <Button
                        text={loading ? 'Signing In...' : 'Sign In'}
                        onClick={() => {}}
                        disabled={loading}
                        className="auth-submit-btn"
                    />
                </form>

                {/* Link to Sign Up */}
                <p className="auth-switch">
                    New to Etown Exchange? <Link to="/signup">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
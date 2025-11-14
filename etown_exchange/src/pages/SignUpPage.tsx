import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import Logo from '../components/Logo';
import Button from '../components/Button';
import Footer from '../components/Footer';
import './styles/AuthPages.css';


const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // handle form submission
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // check if email ends with @etown.edu
        if (!email.endsWith('@etown.edu')) {
            setError("Please use your Elizabethtown College email");
            setLoading(false);
            return;
        }

        // check password length
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        // check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // create user with firebase authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // send email verification
            await sendEmailVerification(user);

            // show success message
            setSuccessMessage('Account created successfully! Please check your email to verify your account.');

            // redirect to login page
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered. Please sign in instead.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak. Please choose a stronger password.');
                    break;
                case 'auth/network-request-failed':
                    setError('Network error. Please check your connection and try again.');
                    break;
                default:
                    setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-page-content">
                <div className="auth-logo">
                    <Logo size="large" onClick={() => navigate('/')} />
                </div>

                {/* form container */}
                <div className="auth-container">
                    <h1 className="auth-title">Create your account</h1>
                    <p className="auth-subtitle">Join the Etown Exchange community</p>

                    {/* signup form */}
                    <form onSubmit={handleSignup} className="auth-form">
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
                            {email && !email.endsWith('@etown.edu') && (
                                <p className="input-hint error">Please use your @etown.edu email</p>
                            )}
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
                            <p className="input-hint">Must be at least 6 characters</p>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            text={loading ? 'Creating Account...' : 'Sign Up'}
                            onClick={() => { }}
                            disabled={loading}
                            className="auth-submit-btn"
                        />
                    </form>

                    {/* Link to Sign In */}
                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </div>
            </div>
            <Footer />

        </div>

    );

};

export default SignUpPage;
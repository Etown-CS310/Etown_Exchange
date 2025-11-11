import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Logo from '../components/Logo';
import './styles/Homepage.css';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage">
            {/* Navigation Header */}
            <header className="homepage-header">
                <Logo 
                    size="medium" 
                    showText={true}
                    onClick={() => navigate('/')}
                />
                <Button 
                    text="Sign In"
                    onClick={() => navigate('/login')}
                    className="sign-in-btn"
                />
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to Etown Exchange</h1>
                    <p className="hero-subtitle">
                        The trusted marketplace for the Elizabethtown College community
                    </p>
                    <p className="hero-description">
                        Buy, sell, and trade items safely with your fellow Blue Jays
                    </p>
                    <div className="hero-buttons">
                        <Button 
                            text="Get Started"
                            onClick={() => navigate('/signup')}
                            className="cta-primary"
                        />
                        <Button 
                            text="Learn More"
                            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                            className="cta-secondary"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Sign In</h3>
                        <p>Create your account with your Etown email</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Post or Browse</h3>
                        <p>List items for sale or find what you need</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Connect</h3>
                        <p>Meet safely on campus to complete your exchange</p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about" id="about">
                <div className="about-content">
                    <h2>About Etown Exchange</h2>
                    <p>
                        Etown Exchange is a campus marketplace designed exclusively 
                        for the Elizabethtown College community. Whether you're looking for textbooks, 
                        furniture, electronics, or other essentials, our platform makes it easy to 
                        buy and sell within our trusted campus community.
                    </p>
                    <div className="about-features">
                        <div className="feature">
                            <span className="feature-icon">🔒</span>
                            <h4>Safe & Secure</h4>
                            <p>Etown email verification required</p>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">🎓</span>
                            <h4>Campus Community</h4>
                            <p>Connect with fellow Blue Jays</p>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">💰</span>
                            <h4>Save Money</h4>
                            <p>Find great deals on campus essentials</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="homepage-footer">
                <p>&copy; 2025 Etown Exchange. Made for Elizabethtown College students.</p>
            </footer>
        </div>
    );
};

export default HomePage;
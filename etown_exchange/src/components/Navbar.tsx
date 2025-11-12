import React from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from '../auth/authContext';
import Logo from './Logo';
import Button from '../components/Button';
import './styles/Navbar.css';


const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {currentUser, signOut} = useAuth();

    const handleSignOut = async() => {
        try{
            signOut();
            navigate('/');
        } catch (err: any){
            console.log(err)
        }
    }

    return(
        <nav className="navbar">
            {/* logo */}
            <div className="navbar-left">
                <Logo 
                size="medium"
                onClick={() => navigate('/dashboard')}
                />
            </div>

            {/* nav links */}
            <div className="navbar-middle">
                <Link to='/dashboard' 
                className={location.pathname === '/dashboard' ? 'nav-link active' : 'nav-link'}
                >
                Browse
                </Link>
                <Link to="/create-listing" 
                className={location.pathname === '/create-listing' ? 'nav-link active' : 'nav-link'}
                >
                Post Listing
                </Link>
                <Link to="/my-listings" 
                className={location.pathname === '/my-listings' ? 'nav-link active' : 'nav-link'}
                >
                My Listings
                </Link>
            </div>

            {/* right section */}
            <div className="navbar-right">
                <span className="user-email">
                    {currentUser?.email}
                </span>
                <Button 
                text="Sign Out"
                onClick={handleSignOut}
                className="sign-out-btn"/>

            </div>
        </nav>
    );
};


export default Navbar;

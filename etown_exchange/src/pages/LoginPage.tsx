import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import Button from '../components/Button';
import '../styles/LoginPage.css';


const LoginPage : React.FC = () => {  
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState("");

    const navigate = useNavigate();
    const handleLogin = () => {
        // placeholder login logic
        if (username.trim() === "" || password.trim() === "") {
            setError("Username and password are required.");
            return;
        }
        setError("");
        // navigate("./home");
    };

    
    return( 
        <div className="login-container">
            <h1 className="login-title">Login Page</h1>
            <div className="login-form-card">
                <form className="login-form" onSubmit={(e) => {e.preventDefault();}}>
                <label className="login-label">Username:</label>
                <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input" />
                <label className="login-label">Password:</label>
                <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"/>

                {error && <p className="login-error">{error}</p>}
                <Button 
                text="Login"
                onClick={handleLogin}
                className="login-button"/>
                </form>
            </div>
            
        </div>
    );

};
export default LoginPage;
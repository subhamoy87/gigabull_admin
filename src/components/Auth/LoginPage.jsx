import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import MessageBox from './MessageBox';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import authConfig from './AuthConfig';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        //// Simple hardcoded authentication
        // if (username === 'abcd' && password === 'abcd') {
        //     login(); 
        //     showMessage('Login Successful!', 'success');          
        //     navigate('/dashboard'); 
        // } else {
        //     showMessage('Invalid username or password.', 'error');
        // }
        // Validate inputs
        if (!username || !password) {
            showMessage('Please enter both username and password', 'error');
            return;
        }

        // Check credentials against config
        const user = authConfig.users.find(
            u => u.username === username && u.password === password
        );

        if (user) {
            login(); 
            showMessage('Login Successful!', 'success');          
            navigate('/dashboard'); 
        } else {
            showMessage('Invalid username or password.', 'error');
        }
    };

    return (
        <div className="login-container">            
            <div className="login-box">
                <h2>Admin Login</h2>                              
                <MessageBox message={message} />
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
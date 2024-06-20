import './styles/Button.css';
import './styles/InputField.css';
import './styles/InputLabel.css';
import './styles/Card.css';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../types/routes';
import { useState } from 'react';
import axios from 'axios';

interface Credentials {
    email: string,
    password: string
}

function Login() {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState<Credentials>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/auth/login', credentials);

            if (response.status === 200) {
                const data = response.data;
                const token = response.data.token;
                // Save user data to localStorage or sessionStorage
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('token', JSON.stringify(token));
                navigate(AppRoutes.GAMES);
            } else {
                setError('Wrong email or password. Please try again.');
            }
        } catch (error) {
            setError('Wrong email or password. Please try again.');
            console.error('Error during login:', error);
        }
    }

    return (
        <div className="parent">
            <div className="child">
                <div className="greeting">
                    <h1>🎮Welcome to GameLand!🎮</h1>
                </div>
                <div className="login-card">
                    <h2>Login</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="email" className="input-label">Email</label>
                        <br />
                        <input
                            type="email"
                            name="email"
                            placeholder="example@example.com"
                            className="input-field"
                            required
                            onChange={handleInputChange}
                        />
                        <br />
                        <label htmlFor="password" className="input-label">Password</label>
                        <br />
                        <input
                            type="password"
                            name="password"
                            placeholder="******"
                            className="input-field"
                            required
                            onChange={handleInputChange}
                        />
                        <br />
                        {error && (
                            <span className="error-message">{error}</span>
                        )}
                        <div className="child">
                            <button className="authentication-button" type="submit">Login</button>
                        </div>
                    </form>
                    <br />
                    <Link to={AppRoutes.SIGN_UP} className="link">Sign up</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;

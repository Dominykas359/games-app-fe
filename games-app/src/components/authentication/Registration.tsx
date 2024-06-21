import './styles/Button.css';
import './styles/InputField.css';
import './styles/InputLabel.css';
import './styles/Card.css';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../types/routes';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GameModel } from '../../models/GameModel';
import { fetchAllGames } from '../../api/GameApi';
import { PlayerModel } from '../../models/PlayerModel';
import { createGamePoints } from '../../api/GamePointsApi';

interface Credentials {
    email: string,
    nickname: string,
    password: string,
    confirmPassword: string
}

enum ErrorType {
    NoError = "no_error",
    UsernameTaken = "username_is_already_taken",
    EmailRegistered = "this_email_is_already_registered",
    TooWeakPassword = "password_too_week",
    PasswordNotMatch = "password_do_not_match",
    Other = "other"
}

interface Err {
    message: String,
    errorType: ErrorType
}

function Registration() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [games, setGames] = useState<GameModel[] | null>(null);
    const [credentials, setCredentials] = useState<Credentials>({
        email: '',
        nickname: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<Err>({
        message: '',
        errorType: ErrorType.NoError 
    });
    const [emailError, setEmailError] = useState<Err>({
        message: '',
        errorType: ErrorType.NoError
    })
    const [nicknameError, setNicknameError] = useState<Err>({
        message: '',
        errorType: ErrorType.NoError
    })
    const navigate = useNavigate();
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(event);
        validatePasswords(event.target.value, credentials.confirmPassword);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(event);
        validatePasswords(credentials.password, event.target.value);
    };

    const handleCheckEmail = async (event: React.FocusEvent<HTMLInputElement>) => {
        const { value } = event.target;

        try {
            const response = await axios.get(`http://localhost:8080/auth/check-email/${value}`);

            if (response) {
                setEmailError({
                    message: 'Email is already registered',
                    errorType: ErrorType.EmailRegistered
                });
            } else {
                setEmailError({
                    message: '',
                    errorType: ErrorType.NoError
                });
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setEmailError({
                message: 'Error checking email',
                errorType: ErrorType.Other
            });
        }
    };

    const handleCheckNickname = async (event: React.FocusEvent<HTMLInputElement>) => {
        const { value } = event.target;

        try {
            const response = await axios.get(`http://localhost:8080/auth/check-nickname/${value}`);

            if (response) {
                setNicknameError({
                    message: 'Username is already taken',
                    errorType: ErrorType.UsernameTaken
                });
            } else {
                setNicknameError({
                    message: '',
                    errorType: ErrorType.NoError
                });
            }
        } catch (error) {
            console.error('Error checking nickname:', error);
            setNicknameError({
                message: 'Error checking nickname',
                errorType: ErrorType.Other
            });
        }
    };

    function isPasswordStrong(password: string): boolean {
        const regex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$');
        return regex.test(password);
    }

    function validatePasswords(password: string, confirmPassword: string) {
        if (!isPasswordStrong(password)) {
            setError({
                message: '',
                errorType: ErrorType.TooWeakPassword
            });
        }
        else {
            if (password !== confirmPassword) {
                setError({
                    message: '',
                    errorType: ErrorType.PasswordNotMatch
                });
            }
            else {
                setError({
                    message: '',
                    errorType: ErrorType.NoError
                });
            }
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting || error.errorType === ErrorType.PasswordNotMatch || error.errorType === ErrorType.TooWeakPassword) return;
        setIsSubmitting(true);
        setError({
            message: '',
            errorType: ErrorType.NoError
        });

        const registerCredentials = {
            email: credentials.email,
            nickname: credentials.nickname,
            password: credentials.password,
        }

        let response;
        try {
            response = await axios.post('http://localhost:8080/auth/register', registerCredentials);

            const user: PlayerModel = response.data;

            if(games){
                for(const game of games){
                    await createGamePoints({
                        id: '',
                        playerId: user.id,
                        gameId: game.id,
                        points: 0
                    })
                }
            }
            
            navigate(AppRoutes.LOG_IN);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchGamesData = async () => {
            try{
                const gamesData = await fetchAllGames();
                setGames(gamesData);
            } catch(error) {
                console.error("Error fetching games:", error);
            }
            
        }
        fetchGamesData();
    }, []);



    return (
        <div className="parent">
            <div className="child">
                <div className="greeting">
                    <h1>🎮Welcome to GameLand!🎮</h1>
                </div>
                <div className="login-card">
                    <h2>Registration</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="user" className="input-label">Email</label>
                        <br />
                        <input type="email"
                            name="email"
                            placeholder="example@example.com"
                            className="input-field"
                            value={credentials.email}
                            onChange={handleInputChange}
                            onBlur={handleCheckEmail}
                            required />
                        {emailError.errorType === ErrorType.EmailRegistered && (
                            <>
                                <br />
                                <span className="error-message">Email is already registered</span>
                            </>
                        )}
                        <br />
                        <label htmlFor="nickname" className="input-label">Username</label>
                        <br />
                        <input type="text"
                            name="nickname"
                            placeholder="Enter your username"
                            className="input-field"
                            value={credentials.nickname}
                            onChange={handleInputChange}
                            onBlur={handleCheckNickname}
                            required />
                        {nicknameError.errorType === ErrorType.UsernameTaken && (
                            <>
                                <br />
                                <span className="error-message">Username is already taken</span>
                            </>
                        )}
                        <br />
                        <label htmlFor="password" className="input-label">Password</label>
                        <br />
                        <input type="password"
                            placeholder="******"
                            name="password"
                            className="input-field"
                            value={credentials.password}
                            onChange={handlePasswordChange}
                            required />
                        {error.errorType === ErrorType.TooWeakPassword && (
                            <>
                                <br />
                                <span className="error-message">Password is too weak</span>
                            </>
                        )}
                        <br />
                        <label htmlFor="confirmPassword" className="input-label">Confirm password</label>
                        <br />
                        <input type="password"
                            placeholder="******"
                            name="confirmPassword"
                            className="input-field"
                            value={credentials.confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required />
                        {error.errorType === ErrorType.PasswordNotMatch && (
                            <>
                                <br />
                                <span className="error-message">Passwords do not match</span>
                            </>
                        )}
                        <div className="child">
                            <button className="authentication-button" type="submit">Sign Up</button>
                        </div>
                    </form>
                    <br />
                    <Link to={AppRoutes.LOG_IN} className="link">Log in</Link>
                </div>
            </div>
        </div>
    );
}

export default Registration;

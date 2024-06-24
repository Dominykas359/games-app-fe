import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../misc/Header';
import './styles/Settings.css';
import { PlayerModel } from '../../models/PlayerModel';
import { deletePlayer, updatePlayer } from '../../api/PlayerApi';
import { updatePassword } from '../../api/ChangePasswordApi';
import { NewPasswordModel } from '../../models/NewPasswordModel';
import ConfirmationModal from '../misc/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../types/routes';

enum ErrorType {
    NoError = 'no_error',
    UsernameTaken = 'username_is_already_taken',
    EmailRegistered = 'this_email_is_already_registered',
    TooWeakPassword = 'password_too_weak',
    PasswordNotMatch = 'password_do_not_match',
    Other = 'other',
}

interface Err {
    message: string;
    errorType: ErrorType;
}

function Settings() {
    const [user, setUser] = useState<PlayerModel | null>(null);
    const [email, setEmail] = useState<string>('');
    const [nickname, setNickname] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<Err>({
        message: '',
        errorType: ErrorType.NoError,
    });
    const [nicknameError, setNicknameError] = useState<Err>({
        message: '',
        errorType: ErrorType.NoError,
    });
    const [passwordError, setPasswordError] = useState<Err>({
        message: '',
        errorType: ErrorType.NoError,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeUser = async () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const data = JSON.parse(userData);
                setUser(data);
                setEmail(data.email);
                setNickname(data.nickname);
            }
        };

        initializeUser();
    }, []);

    useEffect(() => {
        const updateUserInDatabase = async () => {
            if (user) {
                await updatePlayer(user.id, user);
            }
        };
        updateUserInDatabase();
    }, [user]);

    const handleConfirmation = () => {
        setShowConfirmationModal(true);
    };

    const handleCancelConfirmation = () => {
        setShowConfirmationModal(false);
    };

    const handleConfirmDelete = async () => {
        try {
            if(user){
                await deletePlayer(user.id);
            }
            setShowConfirmationModal(false);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate(AppRoutes.LOG_IN);
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(event.target.value);
    };

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPasswordValue = event.target.value;
        setNewPassword(newPasswordValue);
        validatePasswords(newPasswordValue, confirmPassword);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const confirmPasswordValue = event.target.value;
        setConfirmPassword(confirmPasswordValue);
        validatePasswords(newPassword, confirmPasswordValue);
    };

    const handleCheckEmail = async (event: React.FocusEvent<HTMLInputElement>) => {
        const { value } = event.target;

        if (user?.email === value) {
            setEmailError({
                message: '',
                errorType: ErrorType.NoError,
            });
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/auth/check-email/${value}`);

            if (response.data) {
                setEmailError({
                    message: 'Email is already registered',
                    errorType: ErrorType.EmailRegistered,
                });
            } else {
                setEmailError({
                    message: '',
                    errorType: ErrorType.NoError,
                });
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setEmailError({
                message: 'Error checking email',
                errorType: ErrorType.Other,
            });
        }
    };

    const handleCheckNickname = async (event: React.FocusEvent<HTMLInputElement>) => {
        const { value } = event.target;

        if (user?.nickname === value) {
            setNicknameError({
                message: '',
                errorType: ErrorType.NoError,
            });
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/auth/check-nickname/${value}`);

            if (response.data) {
                setNicknameError({
                    message: 'Username is already taken',
                    errorType: ErrorType.UsernameTaken,
                });
            } else {
                setNicknameError({
                    message: '',
                    errorType: ErrorType.NoError,
                });
            }
        } catch (error) {
            console.error('Error checking nickname:', error);
            setNicknameError({
                message: 'Error checking nickname',
                errorType: ErrorType.Other,
            });
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting || emailError.errorType === ErrorType.EmailRegistered || nicknameError.errorType === ErrorType.UsernameTaken) return;
        setIsSubmitting(true);
        try {
            const updatedUser = { ...user, email, nickname } as PlayerModel;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Error updating user information:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (passwordError.errorType !== ErrorType.NoError) {
            return;
        }

        try {
            if (user) {
                const passwordObject: NewPasswordModel = {
                    newPassword: newPassword,
                };
                await updatePassword(user.id, passwordObject);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError({
                message: 'Error changing password',
                errorType: ErrorType.Other,
            });
        }
    };

    function isPasswordStrong(password: string): boolean {
        const regex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$');
        return regex.test(password);
    }

    function validatePasswords(newPassword: string, confirmPassword: string) {
        if (!isPasswordStrong(newPassword)) {
            setPasswordError({
                message: 'Password is too weak',
                errorType: ErrorType.TooWeakPassword,
            });
        } else if (newPassword !== confirmPassword) {
            setPasswordError({
                message: 'Passwords do not match',
                errorType: ErrorType.PasswordNotMatch,
            });
        } else {
            setPasswordError({
                message: '',
                errorType: ErrorType.NoError,
            });
        }
    }

    return (
        <>
            <Header />
            <div className="parent-settings">
                <div>
                    <h1>Settings</h1>
                </div>
                <div className="settings-sections">
                    <div className="information-section">
                        <h2>Personal information</h2>
                        <form onSubmit={handleSubmit} className="settings-form">
                            <div className="input-div">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="email@email.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onBlur={handleCheckEmail}
                                    className="setting-input"
                                    required
                                />
                                <br></br>
                                {emailError.errorType === ErrorType.EmailRegistered && (
                                    <>
                                        <span className="error-message">Email is already registered</span>
                                    </>
                                )}
                            </div>
                          
                            <div className="input-div">
                                <label htmlFor="nickname">Username</label>
                                <input
                                    type="text"
                                    name="nickname"
                                    placeholder="Type in username"
                                    value={nickname}
                                    onChange={handleNicknameChange}
                                    onBlur={handleCheckNickname}
                                    className="setting-input"
                                    required
                                />
                                
                                {nicknameError.errorType === ErrorType.UsernameTaken && (
                                    <>
                                        <span className="error-message">Username is already taken</span>
                                    </>
                                )}
                            </div>
                            <br />
                            <button type="submit" className="save-info">Save</button>
                        </form>

                        <button onClick={handleConfirmation} className="delete-account">Delete account</button>

                        <ConfirmationModal
                            isOpen={showConfirmationModal}
                            message="Are you sure you want to delete your account?"
                            onConfirm={handleConfirmDelete}
                            onCancel={handleCancelConfirmation}
                        />
                    </div>
                    <div className="password-section">
                        <h2>Change password</h2>
                        <form onSubmit={handlePasswordSubmit} className="settings-form">
                            <div className="input-div">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="******"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    className="setting-input"
                                    required
                                />
                                <br />
                                {passwordError.errorType === ErrorType.TooWeakPassword && (
                                    <>
                                        <span className="error-message">{passwordError.message}</span>
                                    </>
                                )}
                            </div>
                            <div className="input-div">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="******"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className="setting-input"
                                    required
                                />
                                <br />
                                {passwordError.errorType === ErrorType.PasswordNotMatch && (
                                    <>
                                        <span className="error-message">{passwordError.message}</span>
                                    </>
                                )}
                            </div>
                            <button type="submit" className="change-password">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Settings;

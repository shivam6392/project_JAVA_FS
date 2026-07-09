import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, User as UserIcon, Mail, Smile } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);
        try {
            await register(username, password, email, name);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card glass-container">
                <div className="auth-header">
                    <h1>Join Apex</h1>
                    <p>Create a student account to get started</p>
                </div>

                {error && (
                    <div className="notification notification-error">
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="notification notification-success">
                        <span>Account created successfully! Redirecting to login...</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
                            Full Name
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Smile size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#a1a1aa' }} />
                            <input
                                id="name"
                                className="form-input"
                                type="text"
                                placeholder="Enter full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ paddingLeft: '48px', width: '100%' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#a1a1aa' }} />
                            <input
                                id="email"
                                className="form-input"
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ paddingLeft: '48px', width: '100%' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="username">
                            Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <UserIcon size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#a1a1aa' }} />
                            <input
                                id="username"
                                className="form-input"
                                type="text"
                                placeholder="Choose username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ paddingLeft: '48px', width: '100%' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <label className="form-label" htmlFor="password">
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#a1a1aa' }} />
                            <input
                                id="password"
                                className="form-input"
                                type="password"
                                placeholder="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingLeft: '48px', width: '100%' }}
                                required
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#a1a1aa' }}>
                    Already have an account?{' '}
                    <span className="auth-link" onClick={() => navigate('/login')}>
                        Login here
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;

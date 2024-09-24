import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/AuthPage.css';

const LoginPage = ({ onLogin }) => {  // Ajoute "onLogin" comme prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email,
                password
            });

            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);

                setSuccess('Connexion réussie !');
                setError('');

                // Appeler la fonction onLogin pour mettre à jour isAuthenticated dans App.js
                onLogin();

                // Rediriger vers le tableau de bord immédiatement
                navigate('/dashboard');
            } else {
                setError('Erreur de connexion');
                setSuccess('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la connexion');
            setSuccess('');
        }
    };

    return (
        <div className="auth-page">
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit">Se connecter</button>
            </form>

            <p>Pas encore inscrit ? <Link to="/signup">Créer un compte</Link></p>
        </div>
    );
};

export default LoginPage;

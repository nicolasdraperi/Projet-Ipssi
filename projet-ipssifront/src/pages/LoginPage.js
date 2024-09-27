import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/css/AuthPage.css';

const LoginPage = ({ setIsAuthenticated, onLogin }) => {  
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
            console.log('Réponse du serveur:', response); // Log de la réponse du serveur
    
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                console.log('Token stocké dans le localStorage:', token);  // Log pour vérifier le stockage du token

                // Décoder le payload du token JWT pour obtenir le rôle de l'utilisateur
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const userRole = decodedToken.role;  // Extraction du rôle
                
                console.log('Rôle de l\'utilisateur:', userRole);  // Log pour vérifier le rôle extrait

                setSuccess('Connexion réussie !');
                setError('');
                setIsAuthenticated(true);
                onLogin();  // Mettre à jour l'état de l'authentification

                // Rediriger en fonction du rôle de l'utilisateur
                if (userRole === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/user/dashboard');
                }
            } else {
                setError('Erreur de connexion');
            }
        } catch (err) {
            setError('Erreur lors de la connexion');
            console.error('Erreur:', err.response ? err.response.data : err.message);  // Log plus détaillé de l'erreur
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

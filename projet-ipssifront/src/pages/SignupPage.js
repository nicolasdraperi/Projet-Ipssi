import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Importer Link et useNavigate
import '../assets/css/AuthPage.css';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/signup', { name, email, password });
            if (response.data.success) {
                setSuccess('Inscription réussie, veuillez vérifier votre email.');
                navigate('/');  // Redirection vers la page de connexion après inscription réussie
            } else {
                setError('Une erreur est survenue lors de l\'inscription.');
            }
        } catch (error) {
            setError('Erreur lors de l\'inscription.');
        }
    };

    return (
        <div className="auth-page">
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom :</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit">S'inscrire</button>
            </form>

            <p>Déjà inscrit ? <Link to="/">Se connecter</Link></p> {/* Lien vers la page de connexion */}
        </div>
    );
};

export default SignupPage;

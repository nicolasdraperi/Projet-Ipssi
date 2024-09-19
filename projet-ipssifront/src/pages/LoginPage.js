import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Importer Link
import '../assets/css/AuthPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');  // Ajouter useState pour success
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Appel à l'API json-server pour chercher l'utilisateur
            const response = await axios.get(`http://localhost:5000/users?email=${email}&password=${password}`);

            if (response.data.length > 0) {
                // Si l'utilisateur est trouvé, on affiche un message de succès
                setSuccess('Connexion réussie !');
                setError('');
                // Rediriger vers une autre page après la connexion
                navigate('/dashboard');  // Redirection vers le tableau de bord (ou autre page)
            } else {
                // Si l'utilisateur n'est pas trouvé, on affiche un message d'erreur
                setError('Identifiants incorrects');
                setSuccess('');
            }
        } catch (err) {
            setError('Erreur lors de la connexion');
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

            <p>Pas encore inscrit ? <Link to="/signup">Créer un compte</Link></p> {/* Lien vers la page d'inscription */}
        </div>
    );
};

export default LoginPage;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Utiliser useNavigate pour rediriger après l'inscription

const SignupPage = () => {
    const [firstName, setFirstName] = useState('');  // Ajouter l'état pour firstName
    const [lastName, setLastName] = useState('');    // Ajouter l'état pour lastName
    const [address, setAddress] = useState('');      // Ajouter l'état pour address
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/register', { 
                firstName, 
                lastName, 
                address, 
                email, 
                password 
            });

            // Vérifier le statut de la réponse
            if (response.status === 201) {  // Si le statut est 201 (inscription réussie)
                setSuccess('Inscription réussie, vous pouvez vous connecter.');
                setError('');
                // Rediriger vers la page de connexion après 2 secondes
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError('Erreur lors de l\'inscription.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription.');
            setSuccess('');
        }
    };

    return (
        <div className="auth-page">
            <h2>Créer un compte</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Prénom :</label>
                    <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <label>Nom :</label>
                    <input 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <label>Adresse :</label>
                    <input 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <label>Email :</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
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
        </div>
    );
};

export default SignupPage;

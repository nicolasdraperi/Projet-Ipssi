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
            const response = await axios.post('http://localhost:5000/api/register', { firstName, lastName, address, email, password });

            if (response.data.success) {
                setSuccess('Inscription réussie, vous pouvez vous connecter.');
                navigate('/login');  // Rediriger vers la page de connexion après inscription réussie
            } else {
                setError('Erreur lors de l\'inscription.');
            }
        } catch (err) {
            setError('Erreur lors de l\'inscription.');
        }
    };

    return (
        <div>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Prénom :</label>
                    <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Nom :</label>
                    <input 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Adresse :</label>
                    <input 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
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
        </div>
    );
};

export default SignupPage;

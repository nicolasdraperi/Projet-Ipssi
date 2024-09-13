import React, { useState } from 'react';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique pour s'inscrire via une API (à implémenter)
        console.log('Name:', name, 'Email:', email, 'Password:', password);
    };

    return (
        <div className="signup-page">
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
                <button type="submit">S'inscrire</button>
            </form>
        </div>
    );
};

export default SignupPage;

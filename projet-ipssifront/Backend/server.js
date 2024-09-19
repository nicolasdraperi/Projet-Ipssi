const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());  // Pour gérer les requêtes avec du JSON

// Simuler une base de données utilisateur
const users = [
    {
        id: 1,
        email: 'user@example.com',
        password: bcrypt.hashSync('password', 10)  // Hasher le mot de passe pour la comparaison plus tard
    }
];

// Route pour gérer la connexion
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Trouver l'utilisateur
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, 'secret', { expiresIn: '1h' });

    res.json({
        message: 'Connexion réussie',
        token  // Renvoyer le token au front-end
    });
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
});

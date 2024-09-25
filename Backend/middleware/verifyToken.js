const jwt = require('jsonwebtoken');

// Middleware pour vérifier le JWT et authentifier l'utilisateur
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'Accès non autorisé. Token manquant.' });
    }

    // Vérifier le token
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide.' });
        }

        // Stocke l'ID de l'utilisateur dans req.userId
        req.userId = decoded.id;
        next();  // Passer à l'étape suivante
    });
};

module.exports = verifyToken;

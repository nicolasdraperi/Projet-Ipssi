const jwt = require('jsonwebtoken');

// Middleware pour vérifier le JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).json({ message: 'Token manquant, accès refusé.' });
    }

    const token = authHeader.split(' ')[1];  // Supprime "Bearer " pour obtenir uniquement le token

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide.' });
        }

        req.userId = decoded.id;  // Stocke l'ID de l'utilisateur dans la requête pour l'utiliser dans les routes
        next();  // Continue vers la route suivante
    });
};

module.exports = verifyToken;

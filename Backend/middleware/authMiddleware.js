const jwt = require('jsonwebtoken');

// Middleware pour vérifier si l'utilisateur est authentifié
exports.isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Token non fourni.' });
    }

    // Le token est généralement sous la forme "Bearer <token>"
    const tokenPart = token.split(' ')[1];

    jwt.verify(tokenPart, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide.' });
        }

        req.user = decoded;  // Stocker les informations utilisateur décodées dans req.user
        next();  // Passer au prochain middleware ou route
    });
};

//admin 
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
    }
    next();
};

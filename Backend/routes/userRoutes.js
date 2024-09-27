const express = require('express');
const { isAuthenticated } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Route GET pour récupérer les informations de l'utilisateur connecté
router.get('/user', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);  // Récupérer l'utilisateur connecté via l'ID stocké dans le token
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        res.json(user);  // Retourner les informations utilisateur
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des informations utilisateur.' });
    }
});

module.exports = router;

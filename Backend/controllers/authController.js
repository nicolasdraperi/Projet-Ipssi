const { User, users } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription
exports.register = (req, res) => {
  const { email, password, firstName, lastName, address } = req.body;
  
  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'Utilisateur déjà inscrit' });
  }

  const newUser = new User(users.length + 1, email, password, firstName, lastName, address);
  users.push(newUser);

  res.status(201).json({ message: 'Inscription réussie' });
};

// Connexion
exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Mot de passe incorrect' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, 'secret_key', { expiresIn: '1h' });
  res.json({ token });
};

import axios from 'axios';

// Configuration de l'instance Axios avec une base URL
const api = axios.create({
    baseURL: 'http://localhost:5000',
});

// Fonction pour se connecter
export const login = (email, password) => {
    return api.post('/login', { email, password });
};

// Fonction pour s'inscrire
export const signup = (name, email, password) => {
    return api.post('/signup', { name, email, password });
};

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

// Fonction pour récupérer les statistiques administratives
export const getAdminStats = () => {
    return api.get('/admin/stats');
};

// Fonction pour récupérer la liste des utilisateurs
export const getAdminUsers = () => {
    return api.get('/admin/users');
};

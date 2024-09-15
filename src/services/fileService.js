import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

// Fonction pour récupérer la liste des fichiers de l'utilisateur
export const getFiles = () => {
    return api.get('/files');
};

// Fonction pour uploader un fichier
export const uploadFile = (fileData) => {
    return api.post('/files/upload', fileData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Fonction pour supprimer un fichier
export const deleteFile = (fileId) => {
    return api.delete(`/files/${fileId}`);
};

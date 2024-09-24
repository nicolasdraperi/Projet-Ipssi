import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);  // Pagination - Page actuelle
    const [totalPages, setTotalPages] = useState(1);  // Nombre total de pages

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/files?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setFiles(response.data.files);
                setTotalPages(response.data.totalPages); // Nombre total de pages
            } catch (error) {
                console.error('Erreur lors de la récupération des fichiers', error);
                setError('Erreur lors du chargement des fichiers.');
            }
        };

        fetchFiles();
    }, [page]);

    const handleDelete = async (fileId) => {
        try {
            await axios.delete(`http://localhost:5000/api/files/${fileId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFiles(files.filter(file => file.id !== fileId)); // Mise à jour de l'interface utilisateur
        } catch (error) {
            setError('Erreur lors de la suppression du fichier.');
        }
    };

    return (
        <div>
            <h3>Mes fichiers</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {files.map((file) => (
                    <li key={file.id}>
                        {file.name} - {(file.size / 1024 / 1024).toFixed(2)} Mo
                        <button onClick={() => handleDelete(file.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>

            {/* Pagination */}
            <div>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button 
                        key={index} 
                        onClick={() => setPage(index + 1)} 
                        disabled={page === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FileList;

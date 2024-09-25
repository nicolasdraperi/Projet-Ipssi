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

    // Fonction pour déterminer si un fichier est une image
    const isImageFile = (fileName) => {
        return /\.(jpeg|jpg|png|gif)$/i.test(fileName);
    };

    return (
        <div>
            <h3>Mes fichiers</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {files.length > 0 ? (
                    files.map((file, index) => {
                        const uniqueKey = file.id || file.name || index; // Utilisation d'une clé unique
                        return (
                            <li key={uniqueKey}>  {/* Utilisation de la clé unique */}
                                {/* Nom du fichier et taille */}
                                <strong>{file.name}</strong> - {(file.size / 1024 / 1024).toFixed(2)} Mo

                                {/* Prévisualisation si c'est une image */}
                                {isImageFile(file.name) ? (
                                    <div>
                                        <img 
                                            src={file.url} 
                                            alt={file.name} 
                                            style={{ width: '100px', height: 'auto' }} 
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer">Visualiser le fichier</a>
                                    </div>
                                )}

                                {/* Bouton pour supprimer le fichier */}
                                <button onClick={() => handleDelete(file.id)}>Supprimer</button>
                            </li>
                        );
                    })
                ) : (
                    <p>Aucun fichier disponible.</p>
                )}
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
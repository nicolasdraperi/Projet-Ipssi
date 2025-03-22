import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const StorageStats = () => {
    const [usage, setUsage] = useState(0); // Espace utilisé en octets
    const [totalStorage, setTotalStorage] = useState(20 * 1024 * 1024 * 1024); // Total en octets (20 Go)

    // Fonction pour récupérer les statistiques de stockage depuis le backend
    const fetchStorageStats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/storage/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsage(response.data.usage); // Stockage utilisé
            setTotalStorage(response.data.totalStorage); // Stockage total (en octets)
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques de stockage', error);
        }
    };

    // Calcul du pourcentage d'utilisation
    const usageInGB = usage / (1024 * 1024 * 1024);
    const totalStorageInGB = totalStorage / (1024 * 1024 * 1024);
    const percentage = (usage / totalStorage) * 100;

    useEffect(() => {
        fetchStorageStats(); // Récupérer les statistiques de stockage au montage du composant
    }, []);

    return (
        <div style={{ width: '200px', margin: '0 auto' }}>
            <h3>Utilisation du stockage</h3>
            <CircularProgressbar
                value={percentage}
                text={`${percentage.toFixed(1)}%`}
                styles={buildStyles({
                    textColor: '#000',
                    pathColor: '#4caf50',
                    trailColor: '#d6d6d6',
                })}
            />
            <p>{usageInGB.toFixed(2)} Go utilisés sur {totalStorageInGB.toFixed(2)} Go disponibles</p>
            <p>Restant : {(totalStorageInGB - usageInGB).toFixed(2)} Go</p>
        </div>
    );
};

export default StorageStats;

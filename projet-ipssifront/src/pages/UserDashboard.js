import React, { useState, useEffect } from 'react';
import Files from '../components/FileList';  // Importer les sous-composants
import FileUpload from '../components/FileUpload';
import PurchaseStorage from '../components/PurchaseStorage';
import Invoices from '../components/Invoices';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';  // Styles pour la barre de progression
import '../assets/css/Dashboard.css';
import axios from 'axios';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('files');  // Onglet actif
    const [usage, setUsage] = useState(0);  // Stockage utilisé en Mo
    const [totalStorage] = useState(20 * 1024);  // Total de stockage en Mo (20 Go)

    useEffect(() => {
        // Fonction pour récupérer les données d'usage de l'API
        const fetchUsage = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/storage-usage', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsage(response.data.usage);  // Mettre à jour l'usage avec la réponse de l'API
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'usage du stockage', error);
            }
        };
        // Appel à fetchUsage après chaque upload
const handleUploadSuccess = () => {
    fetchUsage();  // Mise à jour de l'usage après l'upload
};

// Passer handleUploadSuccess comme prop à FileUpload
<FileUpload onUploadSuccess={handleUploadSuccess} />

        fetchUsage();
    }, []);

    // Fonction pour rendre le contenu de l'onglet actif
    const renderTabContent = () => {
        switch (activeTab) {
            case 'files':
                return <Files />;
            case 'upload':
                return <FileUpload />;
            case 'subscription':
                return <PurchaseStorage />;
            case 'invoices':
                return <Invoices />;
            default:
                return <Files />;
        }
    };

    // Calcul du pourcentage d'utilisation
    const percentage = (usage / totalStorage) * 100;
    const usageInGB = (usage / 1024).toFixed(2);  // Mo vers Go
    const totalStorageInGB = (totalStorage / 1024).toFixed(2);  // Mo vers Go

    return (
        <div className="dashboard">
            <h2>Tableau de bord</h2>

            {/* Onglets de navigation */}
            <nav className="dashboard-nav">
                <button className={activeTab === 'files' ? 'active' : ''} onClick={() => setActiveTab('files')}>Mes fichiers</button>
                <button className={activeTab === 'upload' ? 'active' : ''} onClick={() => setActiveTab('upload')}>Uploader</button>
                <button className={activeTab === 'subscription' ? 'active' : ''} onClick={() => setActiveTab('subscription')}>Acheter de l'espace</button>
                <button className={activeTab === 'invoices' ? 'active' : ''} onClick={() => setActiveTab('invoices')}>Mes factures</button>
            </nav>

            {/* Statistiques d'utilisation du stockage avec CircularProgressbar */}
            <div className="storage-stats">
                <h3>Espace de stockage utilisé</h3>
                <div style={{ width: '150px', margin: '0 auto' }}>
                    <CircularProgressbar
                        value={percentage}
                        text={`${percentage.toFixed(1)}%`}
                        styles={buildStyles({
                            textColor: '#000',
                            pathColor: '#4caf50',
                            trailColor: '#d6d6d6',
                        })}
                    />
                </div>
                <p>{usageInGB} Go utilisés sur {totalStorageInGB} Go disponibles</p>
                <p>Restant : {(totalStorageInGB - usageInGB).toFixed(2)} Go</p>
            </div>

            {/* Contenu de l'onglet actif */}
            <div className="dashboard-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default UserDashboard;

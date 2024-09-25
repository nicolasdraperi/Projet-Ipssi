import React, { useState, useEffect } from 'react';
import Files from '../components/FileList';  // Importer les sous-composants
import FileUpload from '../components/FileUpload';
import PurchaseStorage from '../components/PurchaseStorage';
import Invoices from '../components/Invoices';
import '../assets/css/Dashboard.css';
import axios from 'axios';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('files');  // Onglet actif
    const [usage, setUsage] = useState(0);  // Statistiques d'utilisation de l'espace
    const [totalStorage] = useState(20 * 1024);  // Total de stockage en Mo (20 Go)

    useEffect(() => {
        // Exemple pour récupérer les données d'usage de l'API
        const fetchUsage = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/storage-usage', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsage(response.data.usage);  // Assurez-vous que l'API renvoie les données correctes
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'usage du stockage', error);
            }
        };

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
            {/* Statistiques d'utilisation du stockage */}
                 <div className="storage-stats">
                     <h3>Espace de stockage utilisé</h3>
                     <p>{(usage / 1024).toFixed(2)} Mo sur {totalStorage / 1024} Go utilisés</p>  {/* Conversion en Mo et Go */}
                <div className="progress-bar">
                    <div
                        className="progress"
                        style={{ width: `${(usage / totalStorage) * 100}%` }}  // Barre de progression
                    ></div>
                </div>
            </div>

            {/* Contenu de l'onglet actif */}
            <div className="dashboard-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default UserDashboard;

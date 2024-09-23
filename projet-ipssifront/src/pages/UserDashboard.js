import React, { useState } from 'react';
import Files from '../components/FileList';  // Importer les sous-composants
import FileUpload from '../components/FileUpload';
import PurchaseStorage from '../components/PurchaseStorage';
import Invoices from '../components/Invoices';
import '../assets/css/Dashboard.css'
const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('files');  // Onglet actif

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
                <button onClick={() => setActiveTab('files')}>Mes fichiers</button>
                <button onClick={() => setActiveTab('upload')}>Uploader</button>
                <button onClick={() => setActiveTab('subscription')}>Acheter de l'espace</button>
                <button onClick={() => setActiveTab('invoices')}>Mes factures</button>
            </nav>

            {/* Contenu de l'onglet actif */}
            <div className="dashboard-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default UserDashboard;

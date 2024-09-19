import React from 'react';

const Invoices = () => {
    const invoices = [
        {
            id: 1,
            date: '2024-09-20',
            totalHT: 20,
            totalTTC: 24,
            TVA: 4,
            client: {
                nom: 'Dupont',
                adresse: '123 Rue de la Paix, Paris'
            },
            societe: {
                nom: 'Mon Entreprise',
                adresse: '456 Avenue des Champs-Élysées, Paris',
                siret: '123 456 789 00010'
            }
        }
    ];

    return (
        <div>
            <h2>Mes factures</h2>
            <ul>
                {invoices.map(invoice => (
                    <li key={invoice.id}>
                        <p>Date : {invoice.date}</p>
                        <p>Montant HT : {invoice.totalHT} €</p>
                        <p>Montant TTC : {invoice.totalTTC} €</p>
                        <button>Télécharger la facture</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Invoices;

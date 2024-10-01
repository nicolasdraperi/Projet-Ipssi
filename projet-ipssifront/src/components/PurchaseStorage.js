import React from 'react';

const PurchaseStorage = () => {
    const handlePurchase = () => {
        alert('Achat de 20 Go d\'espace de stockage effectué avec succès.');
    };

    return (
        <div>
            <h2>Acheter de l'espace de stockage</h2>
            <p>Vous pouvez acheter 20 Go d'espace de stockage pour 20 €.</p>
            <button onClick={handlePurchase}>Acheter</button>
        </div>
    );
};

export default PurchaseStorage;

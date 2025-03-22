import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

test('redirection vers login si non authentifié', () => {
    localStorage.removeItem('token');  // Simule un utilisateur non authentifié
    render(
        <Router>
            <App />
        </Router>
    );
    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();  // Vérifie si la page de connexion s'affiche
});

test('redirection vers dashboard si authentifié', () => {
    localStorage.setItem('token', 'mocked-token');  // Simule un utilisateur authentifié
    render(
        <Router>
            <App />
        </Router>
    );
    expect(screen.getByText(/Tableau de bord/i)).toBeInTheDocument();  // Vérifie si le Dashboard s'affiche
});

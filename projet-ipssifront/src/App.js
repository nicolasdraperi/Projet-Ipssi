import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import UserDashboard from './pages/UserDashboard';  // Import du Dashboard

const App = () => {
    return (
        <Router>
            <div className="app">
                <Header />
                <Routes>
                    {/* Route unique pour le Dashboard */}
                    <Route path="/dashboard" element={<UserDashboard />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;

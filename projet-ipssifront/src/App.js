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
                    <Route path="/login" component={LoginPage} />
                    <Route path="/signup" component={SignupPage} />
                    {/* Route unique pour le Dashboard */}
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route exact path="/" component={LoginPage} />  {/* Default route to Login */}
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import UserDashboard from './UserDashboard';
import AdminPage from './AdminPage';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={LoginPage} />
                <Route path="/signup" component={SignupPage} />
                <Route path="/dashboard" component={UserDashboard} />
                <Route path="/admin" component={AdminPage} />
            </Switch>
        </Router>
    );
};

export default App;

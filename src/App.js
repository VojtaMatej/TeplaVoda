import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="app">
            <Navbar />
            <Notification />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
};

const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? children : <Navigate to="/login" />;
};

export default App;

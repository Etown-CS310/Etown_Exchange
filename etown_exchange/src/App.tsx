import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from './auth/authContext';
import ProtectedRoute from './auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import CreateListing from './pages/CreateListing';
import MyListing from './pages/MyListing';
import EditListing from './pages/EditListing';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* public routes */}
          <Route path='/' element={<HomePage />}/>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes (user must be logged in and verified) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-listing" 
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-listings"
            element={
              <ProtectedRoute>
                <MyListing />
              </ProtectedRoute>
            }/>

          <Route 
            path="/edit-listing/:id"
            element={
              <ProtectedRoute>
                <EditListing />
              </ProtectedRoute>
            }/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

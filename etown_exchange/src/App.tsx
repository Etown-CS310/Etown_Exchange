import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from './auth/authContext';
import ProtectedRoute from './auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

// import ListingPage from './pages/ListingPage';


const App: React.FC = () => {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<HomePage />}/>
    //     {/* <Route path="/listing" element={<ListingPage />}/> */}
    //   </Routes>
    // </Router>
    <AuthProvider>
      <Router>
        <Routes>
          {/* public routes */}
          <Route path='/' element={<HomePage />}/>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes (user must be logged in and verified) */}
          {/* <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

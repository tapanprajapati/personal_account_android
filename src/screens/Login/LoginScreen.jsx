import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserDBHandler from '../../databasehandler/userhandler';
import './LoginScreen.css';
import { Container } from '../../styles/global';
import { useAuth } from '../../navigation/AuthContext';

export default function LoginScreen() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const userHandler = new UserDBHandler();
  const {login} = useAuth();

  const handleLogin = () => {
    userHandler.login(username, password).then((result) => {
      if (result.success) {
        login(username, result.token);
        navigate('/dashboard');
      }
    });
  };

    return (
        <Container>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                    Welcome Back
                </h2>
                </div>
                <div className="space-y-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}   
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                    >
                    Log In
                </button>
                </div>
                <p className="mt-4 text-center text-sm text-gray-600">
                {/* <button  className="text-blue-500 font-semibold hover:underline">
                    Sign Up
                </button> */}
                </p>
            </div>
            </div>
        </Container>
    );
}
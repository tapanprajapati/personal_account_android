import React, { createContext, useContext, useState, useEffect } from 'react';
import WebStorage from '../databasehandler/WebStorage';

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined for initial loading state
  const webStorage = new WebStorage();

  useEffect(() => {
    console.log("User in AuthContext: "+webStorage.user)
    setUser(webStorage.user)
  }, []);

  const login = (user, token) => {
    console.log('Logging in user: '+user)
    setUser(user);
    webStorage.setToken(token);
    webStorage.setUser(user)
  };

  const logout = () => {
    console.log('Logging out user')
    setUser(null);
  };

  if (user === undefined) {
    return <div>Loading...</div>; // Show a loading screen while checking auth status
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

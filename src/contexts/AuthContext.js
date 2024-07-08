import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getUser } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignout, setIsSignout] = useState(false);
  

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const signIn = async (username, password) => {
    try {
      const response = await getUser(username, password);
      if (response.success) {
        setUser(response.user);
        await SecureStore.setItemAsync('user', JSON.stringify(response.user));
        setIsSignout(false);
      } else {
        console.error('Failed to sign in: Invalid credentials');
      }
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  const signOut = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync('user');
    setIsSignout(true);
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isSignout, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
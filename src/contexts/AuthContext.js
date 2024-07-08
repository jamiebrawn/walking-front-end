import { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { logIn } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignout, setIsSignout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const signIn = async (username, password) => {
    try {
      const response = await logIn(username, password);
      if (response.status === 200) {
        setUser(response.data.user);
        await SecureStore.setItemAsync(
          "user",
          JSON.stringify(response.data.user)
        );
        setIsSignout(false);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync("user");
    setIsSignout(true);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isSignout, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getCookie } from './cookie';


const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const logoutTimerRef = useRef(null);

  const LOGOUT_TIME = 12 * 60 * 60 * 1000; 

  useEffect(() => {
    // On page load, check if user info and tokens are available in localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedCsrfToken = getCookie('csrftoken'); // You can use a cookie library or your existing function
    const storedAuthToken = localStorage.getItem('authToken'); // Adjust based on how your auth token is stored

    if (storedUser) {
      setUser(storedUser);
    }

    if (storedCsrfToken) {
      setCsrfToken(storedCsrfToken);
    }

    if (storedAuthToken) {
      setAuthToken(storedAuthToken);
    }

    startLogoutTimer(); // Start logout timer on page load
    attachActivityListeners(); // Listen for user activity

    return () => {
      removeActivityListeners(); // Cleanup listeners on unmount
    };
  }, []);

      // Function to start logout timer
      const startLogoutTimer = () => {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = setTimeout(() => {
          logout();
        }, LOGOUT_TIME);
      };

      // Attach event listeners for user activity
      const attachActivityListeners = () => {
        document.addEventListener('mousemove', resetLogoutTimer);
        document.addEventListener('keydown', resetLogoutTimer);
        document.addEventListener('click', resetLogoutTimer);
      };

      // Remove event listeners (cleanup)
      const removeActivityListeners = () => {
        document.removeEventListener('mousemove', resetLogoutTimer);
        document.removeEventListener('keydown', resetLogoutTimer);
        document.removeEventListener('click', resetLogoutTimer);
      };

      // Reset timer on user activity
      const resetLogoutTimer = () => {
        startLogoutTimer();
      };

  const login = (userData, csrfToken, authToken) => {
    setUser(userData);
    setCsrfToken(csrfToken);
    setAuthToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', authToken);
    // Store csrf token in a cookie (if not already done in your app)
    document.cookie = `csrftoken=${csrfToken}; path=/;`;
    startLogoutTimer();
  };

  const logout = () => {
    setUser(null);
    setCsrfToken(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    // Optionally, remove the csrf token from the cookie
    document.cookie = 'csrftoken=; Max-Age=0; path=/;';
    clearTimeout(logoutTimerRef.current); // Clear timer on logout
    removeActivityListeners(); // Remove activity listeners
  };

  return (
    <AuthContext.Provider value={{ user, csrfToken, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
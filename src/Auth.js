import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie } from './cookie';

//const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser ] = useState(() => {
//     const savedUser  = localStorage.getItem('user');
//     return savedUser  ? JSON.parse(savedUser ) : null;
//   });

//   const login = (userData) => {
//     setUser (userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser (null);
//     localStorage.removeItem('user');
//     // Optionally clear the token if used
//     // localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [authToken, setAuthToken] = useState(null);

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
  }, []);

  const login = (userData, csrfToken, authToken) => {
    setUser(userData);
    setCsrfToken(csrfToken);
    setAuthToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', authToken);
    // Store csrf token in a cookie (if not already done in your app)
    document.cookie = `csrftoken=${csrfToken}; path=/;`;
  };

  const logout = () => {
    setUser(null);
    setCsrfToken(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    // Optionally, remove the csrf token from the cookie
    document.cookie = 'csrftoken=; Max-Age=0; path=/;';
  };

  return (
    <AuthContext.Provider value={{ user, csrfToken, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
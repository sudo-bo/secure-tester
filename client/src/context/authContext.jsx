import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null); // State to hold error messages
    const navigate = useNavigate();

   // useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/checkAuth');
                console.log(response.data)
                setIsAuthenticated(response.data.authenticated);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

    //     checkAuth();
    // }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post('/loginUser', credentials);
            if(response.data.error){
                setIsAuthenticated(false);
                toast.error(response.data.error);
            }else{
                setIsAuthenticated(true);
                toast.success('Login Successfull');
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/');
            }           
        } catch (error) {
            setError("Login failed: " + error.response?.data?.error || "An error occurred.");
        }
    };

    const logout = async () => {
        try {
            await axios.post('/logoutUser', {});
            setIsAuthenticated(false);
            setError(null); // Clear any previous errors
        } catch (error) {
            setError("Logout failed: " + error.response?.data?.error || "An error occurred.");
        }
    };

    const register = async (credentials) => {
        try {
            await axios.post('/registerUser', credentials);
            setIsAuthenticated(true);
            setError(null); // Clear any previous errors
        } catch (error) {
            setError("Registration failed: " + error.response?.data?.error || "An error occurred.");
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, register, error, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

// src/hooks/useUserAuth.jsx
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

export const useUserAuth = () => {
    const { loading, user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                clearUser();
                navigate('/login');
            }
        }
    }, [loading, user, clearUser, navigate]);

    return { loading, user };
};


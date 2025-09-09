
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchServer } from "../service/server.js";
const UserContext = createContext();
export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserDetailsWithToken();
        }
        else {
            navigate('/login');
        }
    }, []);
    const fetchUserDetailsWithToken = async () => {
        try {
            const detailsUser = await fetchServer('/users/userId');
            setUser(detailsUser);
        } catch (error) {
            navigate('/login');
            console.error('Error fetching user details:', error);
        }
    };
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
export const useUserContext = () => useContext(UserContext);
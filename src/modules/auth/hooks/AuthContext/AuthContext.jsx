import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import validateTokenController from "@controllers/auth/validateTokenController.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const authInitialState = {
        token: null,
        isAuthenticated: false,
        user: null
    };

    const [auth, setAuth] = useState(authInitialState);
    const [validatingToken, setValidatingToken] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const credentials = JSON.parse(localStorage.getItem("credentials"));
            if(credentials?.token){
                const { success } = await validateTokenController(credentials.token);
                console.log(success);
                if(success){
                    setAuth({
                        token: credentials.token,
                        user: credentials.user,
                        isAuthenticated: true
                    });
                    setValidatingToken(false);
                    return;
                }
            }
            setAuth(authInitialState);
            setValidatingToken(false);
        };

        checkToken();
    }, []);

    const login = (token, user) => {
        const updatedAuth = {
            token, 
            user,
            isAuthenticated: true
        };

        setAuth(updatedAuth);
        localStorage.setItem("credentials", JSON.stringify(updatedAuth));
    };

    const logout = () => {
        localStorage.removeItem("credentials");
        setAuth(authInitialState);
    };

    const value = {
        auth,
        validatingToken,
        setAuth,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "@auth/hooks/AuthContext/UseAuth.jsx";
import { useLoading } from "@common/hooks/Loading/useLoading.jsx";

export function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const { auth, validatingToken, logout } = useAuth();
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        showLoading();
        if(validatingToken) return;

        if(!auth.isAuthenticated){
            logout();
            navigate("/login");
        }
        hideLoading();
    }, [auth.isAuthenticated, validatingToken, navigate, showLoading, hideLoading]);

    if(validatingToken){
        return null;
    }

    if(!auth.isAuthenticated){
        return null;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};
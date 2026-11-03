import {useContext, createContext} from "react";


export const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    loading:true
});

export const useAuth = () => useContext(AuthContext)


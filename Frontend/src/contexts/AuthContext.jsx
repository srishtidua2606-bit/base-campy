import {useContext, createContext} from "react";


export const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    loading:true
});

const useAuth = () => useContext(AuthContext)
export default useAuth;


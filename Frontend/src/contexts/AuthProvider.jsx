import {useState} from "react";
import {AuthContext} from "./AuthContext"

function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)


    return (
        <AuthContext.Provider value= {{user, setUser, isAuthenticated, setIsAuthenticated, loading, setLoading}}>
           {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;

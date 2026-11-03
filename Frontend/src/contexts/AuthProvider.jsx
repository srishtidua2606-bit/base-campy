import {useState} from "react";
import {AuthContext} from "./AuthContext"

function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    useEffect(() => {
        const checkAuth = async () => {
            try{
                const response = await fetch(`${API_BASE_URL}/api/v1/auth/current-user`,{
                    method: "POST",
                    credentials : "include"
                });
                if(!response.ok){
                    console.log(response.mesage || "Session expired")
                }
                const data = response.json()
                setUser(data.data)
                setIsAuthenticated(true)
            }
            catch(error){
                setUser(null)
                setIsAuthenticated(false)

            }
            finally{
                setLoading(false)
            }
        }
        checkAuth()
    },[])

    return (
        <AuthContext.Provider value= {{user, setUser, isAuthenticated, setIsAuthenticated, loading, setLoading}}>
           {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;

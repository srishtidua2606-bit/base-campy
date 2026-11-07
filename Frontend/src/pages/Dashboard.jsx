import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {useAuth} from "../contexts/AuthContext";

import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import ProjectCard from "../components/dashboard/ProjectCard";
import StatCard from "../components/dashboard/StatCard";

import "./Dashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Dashboard(){
    
    const navigate = useNavigate();  //for edirecting to other URLs
    const {
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loading : authLoading,
        setLoading,

    } = useAuth();

    const [projects, setProjects] = useState([]);
    const [projectLoading, setProjectLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("overview");

    useEffect(() => {
        if( !authLoading && !isAuthenticated){
            navigate("/login", {replace: true});
        }
    }, [authLoading, isAuthenticated, navigate]);


    useEffect(() => {
        if ( authLoading || !isAuthenticated) {
            return;
        }
        async function fethProjects(){
            setProjectLoading(true);
            setError("");
            try{
                const response = await fetch(`${API_BASE_URL}/api/v1/projects`, {
                    method:"GET",
                    credentials: "include",
             } )
             const result = await response.json()

             if(!response.ok){
                throw new Error(result?.message || "Unable to fetch projects");
             }
             setProjects(Array.isArray(result.data) ? result.data : []);
            }catch(error){
                setError(error.message);
            } finally {
                setProjectLoading(false);
            }
        }

        fethProjects();
    }, [authLoading, isAuthenticated]);

    const totalProjects = projects.length
    const adminProjects = projects.filter((item) => item.role?.toLowerCase() === "admin").length

    const totalMembers = projects.reduce((total, item) => total + (item.project?.members || 0) , 0)

    async function handleLogout(){
        try{
            await fetch(`${API_BASE_URL}/api/v1/auth/logout`,{
                method:"POST",
                credentials:"include"
            });
        }catch(error){
            console.error("Logout request failed", error)
        }finally{
            setUser(null)
            setIsAuthenticated(false)
            navigate("/login", {replace: true})
        }
    }
    return(
    <Navbar user= {user} onLogout={handleLogout}/>
    )
}
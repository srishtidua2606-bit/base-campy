import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom"
import useAuth from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function ProjectDetails(){
    const {projectId} = useParams();
    const navigate = useNavigate();
    const {isAuthenticated, loading: authLoading} = useAuth();

    const [project, setProject] = useState(null)
    const [projectRole, setProjectRole] =useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if ( authLoading || !isAuthenticated) return;

        async function fetchProject(){
            setLoading(true);
            setError("")

            try{
                const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}`,
                {
                    method: "GET",
                    credentials:"include"

                })

                const result = await response.json()

                if(!response.ok){
                    throw new Error(result?.message || "Unable to fetch project");
                }
                setProject(result.data.project)
                setProjectRole(result.data.role);
            }catch(err){
                setError(err.message || "Something went wrong")

            }finally{
                setLoading(false)
            }
        }
        fetchProject();


    }, [projectId,authLoading, isAuthenticated])

    if(authLoading || loading){
        return <p>Loading Project....</p>
    }
    if (!isAuthenticated) return null;
    if (error){
        return (
            <div>
                <p role = "alert">{error}</p>
                <button onClick = {() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </div>
        );
    }
    if (!project){
        return <p>Project not found:(</p>
    }
    return (
        <main className="project-details-page">
            <button onClick={() => navigate("/dashboard")}>
                ← Back to Dashboard
            </button>

            <section>
                <span>{projectRole}</span>

                <h1>{project.name}</h1>
                <p>{project.description || "No description available."}</p>

                <div>
                    <h3>Project Creator</h3>
                    <p>
                        {project.createdBy?.fullName ||
              project.createdBy?.username ||
              "Unknown"}
                    </p>
                </div>
                <div>
                    <h3>Created On</h3>
                    <p>{new Date(project.createdAt).toLocaleDateString("en-IN")}</p>
                </div>

                <div>
                    <h3>Deadline</h3>
                    <p>{
                        project.deadline? newDate(project.deadline).toLocaleDateString("en-IN"): "No deadline set"}</p>
                </div>
            </section>
        </main>
    )

}

export default ProjectDetails;
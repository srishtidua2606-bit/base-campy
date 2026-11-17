import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom"
import useAuth from "../contexts/AuthContext";
import "./dashboard.css"

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

     if (authLoading || loading) {
    return (
      <main className="project-details-page">
        <div className="project-details-state">
          <p>Loading project...</p>
        </div>
      </main>
    );
  }

    if (!isAuthenticated) return null;
 if (error) {
    return (
      <main className="project-details-page">
        <div className="project-details-state project-details-error">
          <h2>Unable to load project</h2>
          <p>{error}</p>
          <button
            className="project-back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    );
  }
    if (!project) {
    return (
      <main className="project-details-page">
        <div className="project-details-state">
          <h2>Project not found</h2>
          <button
            className="project-back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </main>
    );
  }
  const formattedDate = (date) => 
    new Date(date).toLocaleDateString("en-IN",{
        day:"numeric",
        month:"short",
        year:"numeric",
        timeZone:"Asia/Kolkata",
    });
    return (
        <main className="project-details-page">
            <button className = "project-back-button" onClick={() => navigate("/dashboard")}>
                ← Back to Dashboard
            </button>

        <section className = "project-details-card">
            <div className="project-details-header">
                <div className="project-details-icon">
                  ✦  
                </div>
                <span className = {`project-role ${
                    projectRole.toLowerCase() ==="admin" ?"role-admin":"role-member"
                }`}>{projectRole}</span>

            </div>

            <div className="project-details-into">
                <span className="project-details-intro">
                    PROJECT OVERVIEW
                </span>
                <h1>{project.name}</h1>

                <p>{project.description || "No description provided."}</p>
            </div>
            <div className="project-details-divider"></div>

            <div className="project-details-information">
                <div className="project-info-item">
                    <span className="project-info-icon">♙</span>
                    <div>
                          <span className="project-info-label">
                Project Creator
              </span>
              <h3>{project.createdBy?.fullName || project.createdBy?.username|| "Unknown"}</h3>
                    </div>
                </div>
            </div>
            <div className="project-info-item"> <span className="project-info-icon">▦</span>
            <div>
              <span className="project-info-label">
                Created On
              </span>
              <h3>{formattedDate(project.createdAt)}</h3>
            </div>


         <div className="project-info-item">
            <span className="project-info-icon">◷</span>
            <div>
              <span className="project-info-label">
                Deadline
              </span>
              <h3>
                {project.deadline
                  ? formattedDate(project.deadline)
                  : "No deadline set"}
              </h3>
            </div>
          </div>
        </div>
      </section>
    </main>
    )

}

export default ProjectDetails;
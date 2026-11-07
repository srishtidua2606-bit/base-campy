import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import ProjectCard from "../components/dashboard/ProjectCard";
import StatCard from "../components/dashboard/StatCard";

import "./Dashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function Dashboard() {

    const navigate = useNavigate();  //for edirecting to other URLs
    const {
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loading: authLoading,
        setLoading,

    } = useAuth();

    const [projects, setProjects] = useState([]);
    const [projectLoading, setProjectLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("overview");

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [authLoading, isAuthenticated, navigate]);


    useEffect(() => {
        if (authLoading || !isAuthenticated) {
            return;
        }
        async function fethProjects() {
            setProjectLoading(true);
            setError("");
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/projects`, {
                    method: "GET",
                    credentials: "include",
                })
                const result = await response.json()

                if (!response.ok) {
                    throw new Error(result?.message || "Unable to fetch projects");
                }
                setProjects(Array.isArray(result.data) ? result.data : []);
            } catch (error) {
                setError(error.message);
            } finally {
                setProjectLoading(false);
            }
        }

        fethProjects();
    }, [authLoading, isAuthenticated]);

    const totalProjects = projects.length
    const adminProjects = projects.filter((item) => item.role?.toLowerCase() === "admin").length

    const totalMembers = projects.reduce((total, item) => total + (item.project?.members || 0), 0)

    async function handleLogout() {
        try {
            await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout request failed", error)
        } finally {
            setUser(null)
            setIsAuthenticated(false)
            navigate("/login", { replace: true })
        }
    }
    if(authLoading ){
        return(
            <div className = "dashboard-loading">
                <p>Preparing your workspace....</p>
            </div>
        );
    }
    if(!isAuthenticated){
        return null;
    }
  return (
  <div className="dashboard-layout">

  
    <Sidebar
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    />

    {/* Main dashboard area */}
    <main className="dashboard-main">

      {/* Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
      />

      <div className="dashboard-content">

        {/* We'll put the dashboard sections here */}
        {activeSection === "overview" && (
  <>
    {/* 1. Welcome section */}
    <section className="dashboard-welcome">
      <div>
        <span className="dashboard-section-kicker">
          YOUR TEAM'S SPACE
        </span>

        <h2>
          Welcome back,{" "}
          <span>
            {user?.fullName?.split(" ")[0] ||
              user?.username ||
              "there"}
          </span>
          !
        </h2>

        <p>
          Here's what's happening across your workspace.
        </p>
      </div>
    </section>

    {/* 2. Statistics section */}
    <section className="dashboard-stats">

      <StatCard
        title="Total projects"
        value={projectLoading ? "—" : totalProjects}
        description="Projects you're part of"
        icon="▦"
        accent="teal"
      />

      <StatCard
        title="Admin projects"
        value={projectLoading ? "—" : adminProjects}
        description="Projects you manage"
        icon="✳"
        accent="amber"
      />

      <StatCard
        title="Project memberships"
        value={projectLoading ? "—" : totalMembers}
        description="Combined member count"
        icon="♧"
        accent="coral"
      />

    </section>

    {/* 3. Recent projects section */}
    <section className="dashboard-projects-section">

      <div className="dashboard-section-heading">
        <div>
          <span className="dashboard-section-kicker">
            YOUR WORKSPACE
          </span>

          <h2>Recent projects</h2>

          <p>Keep track of the work you're part of.</p>
        </div>

        <button
          type="button"
          className="dashboard-view-all"
          onClick={() => setActiveSection("projects")}
        >
          View all projects
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="dashboard-error" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Loading, empty or project cards */}
      {projectLoading ? (
        <div className="dashboard-empty-state">
          <p>Loading your projects...</p>
        </div>
      ) : !error && projects.length === 0 ? (
        <div className="dashboard-empty-state">
          <h3>Your workspace is ready.</h3>
          <p>
            You haven't joined any projects yet.
            Once you're part of a project, it will appear here.
          </p>
        </div>
      ) : (
        <div className="dashboard-project-grid">
          {projects.slice(0, 6).map((projectData) => (
            <ProjectCard
              key={projectData.project?._id}
              projectData={projectData}
            />
          ))}
        </div>
      )}

    </section>
  </>
)}
{
    activeSection === "projects" && (
        <section className = "dashboard-projects-section projects-page">
            <div className = "dashboard-section-heading">
                <div>
                  <span className="dashboard-section-kicker">
          ALL YOUR WORK
        </span>

        <h2>My projects</h2>

        <p>Every project you're currently a member of.</p>  
                </div>
            </div>
            {
                error ? (
                    <div className = "dashboard-error" role ="alert">
                        <p>{error}</p>
                    </div>
                ):(
                    projectLoading ? (
                        <div className = "dashboard-empty-state">
                             <p>Loading your projects...</p>
                        </div>
                    ): project.length === 0? (
                        <div className = "dashboard-empty-state">
                            <h3>NO PROJECTS YET</h3>
                            <p>
          Projects you create or join will appear here.
        </p>

                        </div>

                    ):(
                        <div className = "dashboard-project-grid">
                            {
                                projects.map((projectData) => {
                                    <ProjectCard key ={projectData.project?._id} projectData={projectData}/>
                                })
                            }

                        </div>
                    )
                )
            }
            </section>
    )
}

      </div>

    </main>
  </div>
);
 
       
    
}

export default Dashboard;
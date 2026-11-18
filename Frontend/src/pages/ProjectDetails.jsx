
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../contexts/AuthContext";
import "./dashboard.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [project, setProject] = useState(null);
  const [projectRole, setProjectRole] = useState("");
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [membersError, setMembersError] = useState("");
  const [tasksError, setTasksError] = useState("");

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchResource = async (url) => {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Request failed");
      }

      return result.data;
    };

    async function fetchProjectWorkspace() {
      setLoading(true);
      setError("");
      setMembersError("");
      setTasksError("");

      try {
        // Project details are essential; members and tasks load independently.
        const projectData = await fetchResource(
          `${API_BASE_URL}/api/v1/projects/${projectId}`
        );

        setProject(projectData.project);
        setProjectRole(projectData.role || "");

        const [membersResult, tasksResult] = await Promise.allSettled([
          fetchResource(
            `${API_BASE_URL}/api/v1/projects/${projectId}/members`
          ),
          fetchResource(
            `${API_BASE_URL}/api/v1/projects/${projectId}/tasks`
          ),
        ]);

        if (membersResult.status === "fulfilled") {
          setMembers(
            Array.isArray(membersResult.value) ? membersResult.value : []
          );
        } else {
          setMembersError(membersResult.reason.message);
        }

        if (tasksResult.status === "fulfilled") {
          setTasks(
            Array.isArray(tasksResult.value) ? tasksResult.value : []
          );
        } else {
          setTasksError(tasksResult.reason.message);
        }
      } catch (err) {
        setError(err.message || "Unable to load project");
      } finally {
        setLoading(false);
      }
    }

    fetchProjectWorkspace();
  }, [projectId, authLoading, isAuthenticated]);

  if (authLoading || loading) {
    return (
      <main className="project-details-page">
        <div className="project-details-state">
          <div className="project-loading-spinner" />
          <p>Preparing your project workspace...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) return null;

  if (error || !project) {
    return (
      <main className="project-details-page">
        <div className="project-details-state project-details-error">
          <span className="project-state-icon">!</span>
          <h2>{error ? "Unable to load project" : "Project not found"}</h2>
          <p>{error || "This project may have been deleted or is unavailable."}</p>
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

  const completedTasks = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const totalTasks = tasks.length;
  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const formatDate = (date) => {
    if (!date) return "Not set";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Not set";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const creatorName =
    typeof project.createdBy === "object"
      ? project.createdBy?.fullName ||
        project.createdBy?.username ||
        "Unknown"
      : "Unknown";

  return (
    <main className="project-details-page">
      <div className="project-details-container">
        <button
          className="project-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <span>←</span> Back to Dashboard
        </button>

        {/* PROJECT HERO */}
        <section className="project-hero">
          <div className="project-hero-decoration project-hero-decoration-one" />
          <div className="project-hero-decoration project-hero-decoration-two" />

          <div className="project-hero-content">
            <div className="project-hero-topline">
              <span className="project-eyebrow">
                <span className="project-eyebrow-dot" />
                PROJECT WORKSPACE
              </span>

              <span
                className={`project-role ${
                  projectRole.toLowerCase() === "admin"
                    ? "role-admin"
                    : "role-member"
                }`}
              >
                {projectRole || "Member"}
              </span>
            </div>

            <div className="project-hero-main">
              <div className="project-details-icon">✦</div>

              <div className="project-details-intro">
                <h1>{project.name}</h1>
                <p>
                  {project.description ||
                    "No project description has been added yet."}
                </p>
              </div>
            </div>

            <div className="project-hero-footer">
              <span>
                <span className="hero-footer-icon">♙</span>
                Created by <strong>{creatorName}</strong>
              </span>

              <span>
                <span className="hero-footer-icon">▦</span>
                Created {formatDate(project.createdAt)}
              </span>
            </div>
          </div>
        </section>

        {/* QUICK STATISTICS */}
        <section className="project-stat-grid">
          <article className="project-stat-card stat-total">
            <div className="project-stat-top">
              <span className="project-stat-icon">▤</span>
              <span className="project-stat-caption">ALL TASKS</span>
            </div>
            <h2>{totalTasks}</h2>
            <p>Total tasks in this project</p>
          </article>

          <article className="project-stat-card stat-completed">
            <div className="project-stat-top">
              <span className="project-stat-icon">✓</span>
              <span className="project-stat-caption">COMPLETED</span>
            </div>
            <h2>{completedTasks}</h2>
            <p>Tasks successfully completed</p>
          </article>

          <article className="project-stat-card stat-progress">
            <div className="project-stat-top">
              <span className="project-stat-icon">◷</span>
              <span className="project-stat-caption">IN PROGRESS</span>
            </div>
            <h2>{inProgressTasks}</h2>
            <p>Tasks currently being worked on</p>
          </article>

          <article className="project-stat-card stat-members">
            <div className="project-stat-top">
              <span className="project-stat-icon">♧</span>
              <span className="project-stat-caption">TEAM MEMBERS</span>
            </div>
            <h2>{members.length}</h2>
            <p>People in this workspace</p>
          </article>
        </section>

        {/* MAIN CONTENT */}
        <div className="project-details-grid">
          <div className="project-details-main-column">
            {/* PROGRESS */}
            <section className="project-panel project-progress-panel">
              <div className="project-panel-heading">
                <div>
                  <span className="project-panel-kicker">PROJECT HEALTH</span>
                  <h2>Overall progress</h2>
                </div>
                <span className="project-progress-percentage">
                  {progress}%
                </span>
              </div>

              <div
                className="project-progress-track"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Project completion"
              >
                <div
                  className="project-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="project-progress-footer">
                <span>
                  <strong>{completedTasks}</strong> of {totalTasks} tasks
                  completed
                </span>
                <span>
                  {totalTasks === 0
                    ? "Add tasks to start tracking progress"
                    : `${totalTasks - completedTasks} tasks remaining`}
                </span>
              </div>

              <div className="project-task-breakdown">
                <div>
                  <span className="breakdown-dot breakdown-todo" />
                  <span>To Do</span>
                  <strong>{todoTasks}</strong>
                </div>
                <div>
                  <span className="breakdown-dot breakdown-active" />
                  <span>In Progress</span>
                  <strong>{inProgressTasks}</strong>
                </div>
                <div>
                  <span className="breakdown-dot breakdown-done" />
                  <span>Done</span>
                  <strong>{completedTasks}</strong>
                </div>
              </div>

              {tasksError && (
                <p className="project-section-warning">
                  Task statistics are unavailable: {tasksError}
                </p>
              )}
            </section>

            {/* TASK OVERVIEW */}
            <section className="project-panel project-task-panel">
              <div className="project-panel-heading">
                <div>
                  <span className="project-panel-kicker">WORK MANAGEMENT</span>
                  <h2>Task overview</h2>
                </div>
                <span className="project-panel-count">
                  {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
                </span>
              </div>

              {tasksError ? (
                <div className="project-inline-empty">
                  <span>!</span>
                  <p>Could not load tasks. Check the task API endpoint.</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="project-inline-empty">
                  <span>✦</span>
                  <h3>No tasks yet</h3>
                  <p>
                    Tasks added to this project will appear here. Your
                    progress will update automatically.
                  </p>
                </div>
              ) : (
                <div className="project-task-list">
                  {tasks.slice(0, 5).map((task) => (
                    <div className="project-task-row" key={task._id}>
                      <div className={`task-status-symbol task-${task.status}`}>
                        {task.status === "done"
                          ? "✓"
                          : task.status === "in_progress"
                          ? "◷"
                          : "○"}
                      </div>

                      <div className="project-task-info">
                        <strong>{task.title}</strong>
                        <span>
                          {task.assignedTo?.fullName
                            ? `Assigned to ${task.assignedTo.fullName}`
                            : "Unassigned"}
                        </span>
                      </div>

                      <span className={`task-status-label task-label-${task.status}`}>
                        {task.status === "in_progress"
                          ? "In Progress"
                          : task.status === "done"
                          ? "Done"
                          : "To Do"}
                      </span>
                    </div>
                  ))}

                  {tasks.length > 5 && (
                    <p className="project-task-more">
                      + {tasks.length - 5} more tasks
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="project-details-side-column">
            {/* TEAM */}
            <section className="project-panel project-team-panel">
              <div className="project-panel-heading">
                <div>
                  <span className="project-panel-kicker">COLLABORATION</span>
                  <h2>Project team</h2>
                </div>
                <span className="project-panel-count">
                  {members.length}
                </span>
              </div>

              {membersError ? (
                <div className="project-inline-empty">
                  <p>Unable to load team members.</p>
                </div>
              ) : members.length === 0 ? (
                <div className="project-inline-empty">
                  <span>♧</span>
                  <h3>No team members found</h3>
                  <p>Project members will appear here.</p>
                </div>
              ) : (
                <div className="project-member-list">
                  {members.map((member, index) => {
                    const user = member.user || {};
                    const name =
                      user.fullName || user.username || "Unknown member";

                    return (
                      <div className="project-member-row" key={user._id || index}>
                        <div className={`project-member-avatar member-avatar-${index % 4}`}>
                          {getInitials(name)}
                        </div>

                        <div className="project-member-info">
                          <strong>{name}</strong>
                          <span>
                            {member.role?.replaceAll("_", " ") || "Member"}
                          </span>
                        </div>

                        <span
                          className={`member-role-dot ${
                            member.role === "admin" ? "is-admin" : ""
                          }`}
                          title={member.role || "Member"}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* PROJECT DETAILS */}
            <section className="project-panel project-meta-panel">
              <div className="project-panel-heading">
                <div>
                  <span className="project-panel-kicker">AT A GLANCE</span>
                  <h2>Project details</h2>
                </div>
              </div>

              <div className="project-meta-row">
                <span className="project-meta-icon">♙</span>
                <div>
                  <small>Created by</small>
                  <strong>{creatorName}</strong>
                </div>
              </div>

              <div className="project-meta-row">
                <span className="project-meta-icon">▦</span>
                <div>
                  <small>Created on</small>
                  <strong>{formatDate(project.createdAt)}</strong>
                </div>
              </div>

              <div className="project-meta-row">
                <span className="project-meta-icon">◷</span>
                <div>
                  <small>Deadline</small>
                  <strong>{formatDate(project.deadline)}</strong>
                </div>
              </div>

              <div className="project-meta-row">
                <span className="project-meta-icon">♧</span>
                <div>
                  <small>Your role</small>
                  <strong className="capitalize-text">
                    {projectRole.replaceAll("_", " ") || "Member"}
                  </strong>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default ProjectDetails;

function ProjectCard({projectData}){
    const project = projectData.project;
    const role = project.role || "Member"
    const projectName = projectData?.name || "Untitled Project";
    
    const description = projectData?.description || "No description provided";

    const memberCount = project?.members ?? 0;
    const formattedDate = project?.createdAt? new Date(project.createdAt).toLocaleDateString("en-IN",{
        day: "numeric",
        month: "short",
        year: "numeric"
    }) : "Date Unavailable";
    return(
        <article className = "project-card">
            <div className = "project-card-top">
                <div className = "project-card-icon" aria-hidden="true">
                    {projectName.charAt(0).toUpperCase()}
</div>
 <span className={`project-role role-${role.toLowerCase()}`}>
          {role}
        </span>
            </div>

            <div className = "project-card=content">
                <h3>{projectName}</h3>
                <p>{description}</p>
            </div>
            <div className = " project-card-footer">
                 <span>
          <span aria-hidden="true">♧</span>
          {memberCount} {memberCount === 1 ? "member" : "members"}
        </span>
        <span>Created {formattedDate}</span>
            </div>
        </article>
    )
}
export default ProjectCard;
function StatCard({title, value , description, icon, accent}){
 
    return(
        <article className = {`start-card stat-card-${accent}`}>
            <div className = "stat-card-top">
               <span className = "stat-card-icon" aria-hidden="true">{icon}</span> 
               <span className = "stat-card-indicator">Overview</span>
            </div>
            <div className = "stat-card-content">
                <p>{title}</p>
                <h2>{value}</h2>
                <span>{description}</span>
            </div>
        </article>
    );
}

export default StatCard;
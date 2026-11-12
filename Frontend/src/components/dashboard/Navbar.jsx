function Navbar({ user, onLogout }) {
    const fullName = user?.fullName || user?.username || "User";

    const words = fullName.trim().split('/\s+/');
    const initials = words.length > 1 ? words.slice(0,2).map((word) => word[0]).join("").toUpperCase()
    : fullName.slice(0,2).toUpperCase()

    return (
        <header className="dashboard-navbar">
            <div className="dashboard-navbar-heading">
                <span className="dashboard-navbar-eyebrow">
                    YOUR WORKSPACE
                </span>
                <h1>Workspace overview</h1>
            </div>

            <div className="dashboard-navbar-actions">
                <div className="dashboard-user">
                    <div className="dashboard-user-avatar">
                        {
                            user?.avatar?.url && !user.avatar.url.includes("placehold.co")? (<img src={user.avatar.url} alt={fullName} />)
                                : (<span>{initials}</span>)
                        }
                    </div>

                    <div className="dashboard-user-info">
                        <strong>{fullName} </strong>
                        <small>{user?.email || "Workspace member"}</small>
                    </div>
                </div>

                <button 
                type="button"
                className= "dashboard-logout-button"
                onClick={onLogout}
                >
                    Logout
                </button>
            </div>



        </header>
    );
}

export default Navbar;
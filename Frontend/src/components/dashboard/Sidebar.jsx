import BasecampyLogo from "../../assets/basecampy-logo.svg"

function Sidebar({activeSection, setActiveSection}) {
    const navigationItems = [
        {
            id:"overview",
            label:"Overview",
             icon: "⌂",
        },
        {
            id:"projects",
            label:"Projects",
            icon: "▦",
        }
    ];

    return(
        <aside className = "dashboard-sidebar">
            <div className = "dashboard-sidebar-brand">
                <img src={BasecampyLogo} alt = "Basecampy Logo" />
                <span>Basecampy</span>
                <span className="dashboard-brand-sparkle">✳</span>
                </div>

            <div className = "sidebar-workspace">
                <span className = "sidebar-workspace-icon">
                    B
                </span>
            

            <div>
                <strong>My Workspace</strong>
                <small>Personal Workspace</small>
            </div>

             <span className="sidebar-workspace-arrow">⌄</span>
</div>
<div className = "sidebar-navigation">
    <p className = "sidebar-section-label">WORKSPACE</p>
    <nav aria-label = "Dashboard navigation">
        {navigationItems.map((item) => {
            <button key = {item.id} type ="button" className = {`sidebar-nav-item ${
                activeSection === item.id? "active" : ""
             }`}
             onClick ={() => setActiveSection(item.id)} aria-current = {activeSection === item.id ? "page" : undefined}>
        <span className = "sidebar-nav-icon">{item.icon}</span>
        <span>{item.label}</span>
        </button>
        })}
    </nav>
    </div>

    <div className = "sidebar-bottom">
        <div className="sidebar-help-icon">?</div>
        <div>
            <strong>Need a hand?</strong>
            <small>Keep your work moving.</small>
        </div>
    </div>
        </aside>
    );
}

export default Sidebar;
import { NavLink } from "react-router-dom";

const PRIMARY_ITEMS = [
  { to: "/", label: "Overview", icon: "OV" },
  { to: "/roles", label: "Recommended Roles", icon: "RR" },
  { to: "/jobs", label: "Job Postings", icon: "JP" },
  { to: "/career-focus", label: "Career Focus", icon: "CF" },
];

const SECONDARY_ITEMS = [
  { to: "/skills", label: "Your Skills", icon: "SK" },
  { to: "/profile", label: "Profile", icon: "PR" },
];

function Sidebar({ isOpen, onClose, onNavigate }) {
  return (
    <>
      <button
        type="button"
        className={`sidebar-backdrop ${isOpen ? "is-visible" : ""}`}
        onClick={onClose}
        aria-label="Close navigation"
      />

      <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="sidebar__brand">
          <div className="sidebar__brand-mark">CG</div>
          <div>
            <h2>CareerGraph</h2>
            <p>Career Intelligence</p>
          </div>
        </div>

        <nav className="sidebar__nav" aria-label="Primary navigation">
          {PRIMARY_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "is-active" : ""}`
              }
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__divider" />

        <nav className="sidebar__nav" aria-label="Secondary navigation">
          {SECONDARY_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "is-active" : ""}`
              }
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;

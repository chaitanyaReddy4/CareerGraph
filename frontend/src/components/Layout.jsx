import { useEffect, useMemo, useRef, useState } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

import {
  getJobsForRole,
  getRecommendedRoles,
} from "../services/api";
import {
  DEMO_USER_ID,
  normalizeJob,
  normalizeRole,
} from "../utils/careerData";
import Sidebar from "./Sidebar";

const PAGE_TITLES = [
  { path: "/", title: "Career Overview" },
  { path: "/roles", title: "Recommended Roles" },
  { path: "/roles/:roleId", title: "Role Details" },
  { path: "/jobs", title: "Job Postings" },
  { path: "/jobs/:jobId", title: "Job Details" },
  { path: "/career-focus", title: "Career Focus" },
  { path: "/skills", title: "Your Skills" },
  { path: "/profile", title: "Profile" },
];

function getPageTitle(pathname) {
  const match = PAGE_TITLES.find((item) =>
    matchPath({ path: item.path, end: true }, pathname)
  );

  return match?.title || "CareerGraph";
}

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    roles: [],
    jobs: [],
    skills: [],
  });
  const searchRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    async function loadSearchData() {
      try {
        setSearchLoading(true);
        const data = await getRecommendedRoles(DEMO_USER_ID);
        const roles = (data?.recommendations || [])
          .map(normalizeRole)
          .sort((left, right) => right.matchPercentage - left.matchPercentage);

        const jobResults = await Promise.all(
          roles.map(async (role) => {
            try {
              const response = await getJobsForRole(role.roleId);
              return (response?.jobs || []).map((job) => normalizeJob(job));
            } catch (error) {
              console.error(error);
              return [];
            }
          })
        );

        if (!isActive) {
          return;
        }

        const jobs = [...new Map(
          jobResults
            .flat()
            .map((job) => [job.jobId, job])
        ).values()];

        const skills = [...new Map(
          roles
            .flatMap((role) => [...role.matchedSkills, ...role.missingSkills])
            .map((skill) => [
              skill.toLowerCase(),
              {
                id: skill.toLowerCase().replace(/\s+/g, "-"),
                name: skill,
              },
            ])
        ).values()];

        setSearchData({
          roles,
          jobs,
          skills,
        });
      } catch (error) {
        console.error(error);
      } finally {
        if (isActive) {
          setSearchLoading(false);
        }
      }
    }

    loadSearchData();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!searchRef.current?.contains(event.target)) {
        setSearchOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchGroups = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    const roles = searchData.roles
      .filter((role) =>
        [role.role, role.category]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery))
      )
      .slice(0, 5)
      .map((role) => ({
        id: role.roleId,
        title: role.role,
        subtitle: role.category,
        type: "role",
        onSelect: () => navigate(`/roles/${role.roleId}`),
      }));

    const skills = searchData.skills
      .filter((skill) => skill.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 5)
      .map((skill) => ({
        id: skill.id,
        title: skill.name,
        subtitle: "Open skill inventory",
        type: "skill",
        onSelect: () => navigate("/skills"),
      }));

    const jobs = searchData.jobs
      .filter((job) =>
        [job.jobTitle, job.company, job.role]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery))
      )
      .slice(0, 6)
      .map((job) => ({
        id: job.jobId,
        title: job.jobTitle,
        subtitle: `${job.company} — ${job.role}`,
        type: "job",
        onSelect: () => navigate(`/jobs/${job.jobId}`),
      }));

    return [
      {
        label: "Roles",
        items: roles,
      },
      {
        label: "Skills",
        items: skills,
      },
      {
        label: "Jobs",
        items: jobs,
      },
    ].filter((group) => group.items.length > 0);
  }, [navigate, normalizedQuery, searchData.jobs, searchData.roles, searchData.skills]);

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);
    setSearchOpen(true);
  }

  function handleSearchSelect(onSelect) {
    onSelect();
    setSearchOpen(false);
  }

  const showSearchDropdown = searchOpen && normalizedQuery.length > 0;

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={() => setSidebarOpen(false)}
      />

      <div className="app-main">
        <header className="top-header">
          <div className="top-header__primary">
            <button
              type="button"
              className="menu-button"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </button>

            <div>
              <p className="top-header__eyebrow">CareerGraph</p>
              <h1>{getPageTitle(location.pathname)}</h1>
            </div>
          </div>

          <div className="top-header__actions">
            <div className="search-shell" ref={searchRef}>
              <label className="search-field" htmlFor="app-search">
                <span>S</span>
                <input
                  id="app-search"
                  type="search"
                  placeholder="Search roles, skills, companies..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (normalizedQuery) {
                      setSearchOpen(true);
                    }
                  }}
                  aria-expanded={showSearchDropdown}
                  aria-controls="app-search-results"
                  aria-autocomplete="list"
                />
              </label>

              {showSearchDropdown ? (
                <div className="search-dropdown" id="app-search-results" role="listbox">
                  {searchGroups.length > 0 ? (
                    searchGroups.map((group) => (
                      <div className="search-group" key={group.label}>
                        <p className="search-group__label">{group.label}</p>
                        <div className="search-group__items">
                          {group.items.map((item) => (
                            <button
                              key={`${item.type}-${item.id}`}
                              type="button"
                              className="search-result"
                              onClick={() => handleSearchSelect(item.onSelect)}
                            >
                              <span className="search-result__title">{item.title}</span>
                              <span className="search-result__subtitle">{item.subtitle}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="search-empty">
                      {searchLoading ? "Searching..." : "No matching results"}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="icon-button"
              aria-label="Notifications"
            >
              N
            </button>

            <div className="header-profile">
              <div className="header-profile__avatar">D</div>
              <div className="header-profile__meta">
                <strong>Demo User</strong>
                <span>Career Profile</span>
              </div>
            </div>
          </div>
        </header>

        <div className="page-shell">{children}</div>
      </div>
    </div>
  );
}

export default Layout;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import RoleCard from "../components/RoleCard";
import SkillTag from "../components/SkillTag";
import StatCard from "../components/StatCard";
import StatusCard from "../components/StatusCard";
import { getRecommendedRoles } from "../services/api";
import {
  collectSkillGaps,
  DEMO_USER_ID,
  normalizeRole,
} from "../utils/careerData";

function Home() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoles() {
      try {
        setLoading(true);
        setError("");
        const data = await getRecommendedRoles(DEMO_USER_ID);
        const recommendations = (data?.recommendations || [])
          .map(normalizeRole)
          .sort((left, right) => right.matchPercentage - left.matchPercentage);

        setRoles(recommendations);
      } catch (err) {
        console.error(err);
        setError("Unable to load career recommendations.");
      } finally {
        setLoading(false);
      }
    }

    loadRoles();
  }, []);

  const bestRole = roles[0] || null;
  const topGaps = useMemo(() => collectSkillGaps(roles).slice(0, 4), [roles]);
  const totalSkills = useMemo(
    () => new Set(roles.flatMap((role) => role.matchedSkills)).size,
    [roles]
  );

  if (loading) {
    return (
      <StatusCard
        type="loading"
        title="Finding your recommended roles..."
        description="We are analyzing the skills already associated with your profile."
      />
    );
  }

  if (error) {
    return (
      <StatusCard
        type="error"
        title="Unable to load this information."
        description={error}
        action={
          <button
            type="button"
            className="button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        }
      />
    );
  }

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Good morning, Demo User!"
        description="Here's where your current skills can take you."
      />

      <section className="stats-grid">
        <StatCard
          label="Your Skills"
          value={totalSkills || 0}
          description="Skills in your profile"
          tone="purple"
        />
        <StatCard
          label="Best Match"
          value={`${bestRole?.matchPercentage || 0}%`}
          description="Top role match"
          tone="success"
        />
        <StatCard
          label="Roles Analyzed"
          value={roles.length}
          description="Career roles found"
          tone="blue"
        />
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel__header">
            <div>
              <h3>Recommended Roles</h3>
              <p>Roles ranked by how closely they match your current skills.</p>
            </div>

            <button
              type="button"
              className="button button--ghost"
              onClick={() => navigate("/roles")}
            >
              View all
            </button>
          </div>

          {roles.length === 0 ? (
            <StatusCard
              type="empty"
              title="No career recommendations available yet."
              description="Add more skills to your profile to unlock better career matches."
              compact
            />
          ) : (
            <div className="stack">
              {roles.slice(0, 3).map((role) => (
                <RoleCard
                  key={role.roleId}
                  role={role}
                  onView={() => navigate(`/roles/${role.roleId}`)}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="dashboard-side">
          <section className="panel panel--profile">
            <div className="profile-summary">
              <div className="profile-summary__avatar">D</div>
              <div>
                <h3>Demo User</h3>
                <p>B.Tech / CSE</p>
                <p>Dhanekula Institute of Engg.</p>
                <span>Last updated: Today</span>
              </div>
            </div>

            <div className="profile-performance">
              <div>
                <p>Skills Matched</p>
                <strong>
                  {bestRole?.matchedSkillsCount || totalSkills} /{" "}
                  {bestRole?.totalRequiredSkills || 0}
                </strong>
              </div>
              <div>
                <p>Overall Readiness</p>
                <strong>{bestRole?.matchPercentage || 0}%</strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Top Skill Gaps</h3>
                <p>Priorities that can improve your match quickly.</p>
              </div>
            </div>

            {topGaps.length === 0 ? (
              <StatusCard
                type="empty"
                title="No major skill gaps right now."
                description="Your current matches already cover the available role requirements."
                compact
              />
            ) : (
              <div className="gap-list">
                {topGaps.map((gap) => (
                  <div className="gap-row" key={gap.skill}>
                    <div>
                      <strong>{gap.skill}</strong>
                      <p>{gap.reason}</p>
                    </div>
                    <SkillTag
                      tone={gap.priority === "High Priority" ? "danger" : "warning"}
                    >
                      {gap.priority}
                    </SkillTag>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="button button--link"
              onClick={() => navigate("/career-focus")}
            >
              Go to Career Focus
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Home;

import { useEffect, useMemo, useState } from "react";

import PageHeader from "../components/PageHeader";
import SkillTag from "../components/SkillTag";
import StatCard from "../components/StatCard";
import StatusCard from "../components/StatusCard";
import { getRecommendedRoles } from "../services/api";
import {
  collectSkillGaps,
  DEMO_USER_ID,
  normalizeRole,
} from "../utils/careerData";

function Profile() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
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
        setError("Unable to load profile summary.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const bestRole = roles[0] || null;
  const skills = useMemo(
    () => [...new Set(roles.flatMap((role) => role.matchedSkills))].slice(0, 10),
    [roles]
  );
  const gaps = useMemo(() => collectSkillGaps(roles).slice(0, 4), [roles]);

  if (loading) {
    return (
      <StatusCard
        type="loading"
        title="Loading your profile..."
        description="We are summarizing your readiness from the current role recommendation data."
      />
    );
  }

  if (error) {
    return (
      <StatusCard
        type="error"
        title="Unable to load this information."
        description={error}
      />
    );
  }

  return (
    <div className="content-page">
      <PageHeader
        eyebrow="Profile Overview"
        title="Demo User"
        description="B.Tech / CSE / Dhanekula Institute of Engineering and Technology"
      />

      <section className="profile-hero">
        <div className="profile-hero__identity">
          <div className="profile-summary__avatar">D</div>
          <div>
            <h3>Career Readiness Profile</h3>
            <p>Your current data is presented as a read-only overview.</p>
          </div>
        </div>

        <div className="profile-hero__stats">
          <StatCard
            label="Career Readiness"
            value={`${bestRole?.matchPercentage || 0}%`}
            description="Top role match"
            tone="success"
          />
          <StatCard
            label="Skills"
            value={skills.length}
            description="Recognized from current role matches"
            tone="purple"
          />
        </div>
      </section>

      <div className="detail-grid">
        <section className="panel">
          <div className="panel__header">
            <div>
              <h3>Skills</h3>
              <p>Your strongest signals from the current recommendation engine.</p>
            </div>
          </div>

          <div className="tag-row">
            {skills.map((skill) => (
              <SkillTag key={skill} tone="success">
                {skill}
              </SkillTag>
            ))}
          </div>
        </section>

        <aside className="dashboard-side">
          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Career Readiness</h3>
                <p>Current best-fit path based on your matched skills.</p>
              </div>
            </div>
            <div className="summary-list">
              <div className="summary-list__row">
                <span>Top role</span>
                <strong>{bestRole?.role || "Not available"}</strong>
              </div>
              <div className="summary-list__row">
                <span>Matched skills</span>
                <strong>{bestRole?.matchedSkillsCount || 0}</strong>
              </div>
              <div className="summary-list__row">
                <span>Skill gaps</span>
                <strong>{bestRole?.missingSkills.length || 0}</strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Improvement Areas</h3>
                <p>High-value gaps surfaced by current recommendations.</p>
              </div>
            </div>
            <div className="tag-row">
              {gaps.map((gap) => (
                <SkillTag key={gap.skill} tone="warning">
                  {gap.skill}
                </SkillTag>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Profile;

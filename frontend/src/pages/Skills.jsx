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

function Skills() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSkills() {
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
        setError("Unable to load skills from current recommendation data.");
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  const skillEntries = useMemo(() => {
    const skillMap = new Map();

    roles.forEach((role) => {
      role.matchedSkills.forEach((skill) => {
        skillMap.set(skill, (skillMap.get(skill) || 0) + 1);
      });
    });

    return [...skillMap.entries()].sort((left, right) => right[1] - left[1]);
  }, [roles]);

  const gaps = useMemo(() => collectSkillGaps(roles), [roles]);

  if (loading) {
    return (
      <StatusCard
        type="loading"
        title="Loading your skills..."
        description="We are summarizing the skills used in your current role recommendations."
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
        eyebrow="Profile Skills"
        title="Your Skills"
        description="Skills currently associated with your CareerGraph profile."
      />

      <section className="stats-grid">
        <StatCard
          label="Current Skills"
          value={skillEntries.length}
          description="Distinct skills identified"
          tone="purple"
        />
        <StatCard
          label="Role Coverage"
          value={roles.length}
          description="Recommended roles using these skills"
          tone="blue"
        />
        <StatCard
          label="Potential Gaps"
          value={gaps.length}
          description="Missing skills surfaced by recommendations"
          tone="success"
        />
      </section>

      <div className="detail-grid">
        <section className="panel">
          <div className="panel__header">
            <div>
              <h3>Skill Inventory</h3>
              <p>Derived from the skills already matching your recommended roles.</p>
            </div>
          </div>

          {skillEntries.length === 0 ? (
            <StatusCard
              type="empty"
              title="No skill data available yet."
              compact
            />
          ) : (
            <div className="skill-grid">
              {skillEntries.map(([skill, count]) => (
                <div className="skill-card" key={skill}>
                  <h4>{skill}</h4>
                  <p>{count > 2 ? "Advanced" : count > 1 ? "Intermediate" : "Developing"}</p>
                  <span>Used in {count} recommended {count === 1 ? "role" : "roles"}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="dashboard-side">
          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Potential Skill Gaps</h3>
                <p>Areas that appear missing across your current recommendations.</p>
              </div>
            </div>

            <div className="tag-row">
              {gaps.slice(0, 8).map((gap) => (
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

export default Skills;

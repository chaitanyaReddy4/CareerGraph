import { useEffect, useMemo, useState } from "react";

import PageHeader from "../components/PageHeader";
import SkillTag from "../components/SkillTag";
import StatusCard from "../components/StatusCard";
import { getRecommendedRoles } from "../services/api";
import {
  collectSkillGaps,
  DEMO_USER_ID,
  normalizeRole,
} from "../utils/careerData";

function CareerFocus() {
  const [roles, setRoles] = useState([]);
  const [focusSkills, setFocusSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFocusData() {
      try {
        setLoading(true);
        setError("");
        const data = await getRecommendedRoles(DEMO_USER_ID);
        const recommendations = (data?.recommendations || [])
          .map(normalizeRole)
          .sort((left, right) => right.matchPercentage - left.matchPercentage);
        const gaps = collectSkillGaps(recommendations).slice(0, 6);

        setRoles(recommendations);
        setFocusSkills(gaps.map((gap) => gap.skill));
      } catch (err) {
        console.error(err);
        setError("Unable to load career focus recommendations.");
      } finally {
        setLoading(false);
      }
    }

    loadFocusData();
  }, []);

  const gaps = useMemo(() => collectSkillGaps(roles).slice(0, 6), [roles]);
  const topMatch = roles[0] || null;
  const focusRoles = useMemo(
    () =>
      roles.map((role) => ({
        roleId: role.roleId,
        role: role.role,
        matchPercentage: role.matchPercentage,
        matchedSkills: role.matchedSkills,
        missingSkills: role.missingSkills,
      })),
    [roles]
  );

  function toggleRoleFocus(skills) {
    const hasEverySkill = skills.length > 0 && skills.every((skill) =>
      focusSkills.includes(skill)
    );

    setFocusSkills((current) =>
      hasEverySkill
        ? current.filter((skill) => !skills.includes(skill))
        : [...new Set([...current, ...skills])]
    );
  }

  if (loading) {
    return (
      <StatusCard
        type="loading"
        title="Building your career focus..."
        description="We are translating role skill gaps into a practical learning plan."
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
        eyebrow="Action Plan"
        title="Career Focus"
        description="Build the skills that will improve your career readiness."
      />

      <section className="focus-summary">
        <div className="focus-summary__card">
          <p className="page-header__eyebrow">Recommended Roles</p>
          <h3>{roles.length} role{roles.length === 1 ? "" : "s"} available</h3>
        </div>
        <div className="focus-summary__card">
          <p className="page-header__eyebrow">Top Match</p>
          <h3>{topMatch ? `${topMatch.matchPercentage}%` : "0%"}</h3>
        </div>
      </section>

      <div className="detail-grid">
        <main className="stack">
          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Priority Skill Gaps</h3>
                <p>Missing skills pulled directly from your recommended roles.</p>
              </div>
            </div>

            {gaps.length === 0 ? (
              <StatusCard
                type="empty"
                title="No skill gaps available right now."
                compact
              />
            ) : (
              <div className="stack">
                {gaps.map((gap) => (
                  <div className="focus-card" key={gap.skill}>
                    <div>
                      <h4>{gap.skill}</h4>
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
          </section>
        </main>

        <aside className="dashboard-side">
          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Recommended Focus</h3>
                <p>Front-end focus markers only. No new persistence APIs added.</p>
              </div>
            </div>

            <div className="stack">
              {focusRoles.map((role, index) => {
                const active =
                  role.missingSkills.length > 0 &&
                  role.missingSkills.every((skill) => focusSkills.includes(skill));

                return (
                  <div className="focus-priority" key={role.roleId}>
                    <div className="focus-priority__number">{index + 1}</div>
                    <div className="focus-priority__body">
                      <h4>{role.role}</h4>
                      <p>
                        {role.matchPercentage}% match with {role.missingSkills.length} skill
                        {role.missingSkills.length === 1 ? " gap" : " gaps"}.
                      </p>
                      <p>
                        {role.missingSkills.length > 0
                          ? `Gaps: ${role.missingSkills.join(", ")}`
                          : "No skill gaps identified."}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`button ${active ? "button--light" : "button--ghost"}`}
                      onClick={() => toggleRoleFocus(role.missingSkills)}
                      disabled={role.missingSkills.length === 0}
                    >
                      {active ? "Focused" : "Mark as focus"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default CareerFocus;

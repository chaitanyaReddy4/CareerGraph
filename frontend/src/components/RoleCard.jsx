import MatchBadge from "./MatchBadge";
import ProgressBar from "./ProgressBar";
import SkillTag from "./SkillTag";

function RoleCard({
  role,
  onView,
  actionLabel = "View Role",
  compact = false,
}) {
  const matchedSkills = role.matchedSkills || [];
  const missingSkills = role.missingSkills || [];

  return (
    <article className={`role-card ${compact ? "role-card--compact" : ""}`}>
      <div className="role-card__main">
        <div className="role-card__identity">
          <div className="role-card__icon">{role.shortCode}</div>
          <div>
            <h3>{role.role}</h3>
            <p className="role-card__category">{role.category}</p>
          </div>
        </div>

        <div className="role-card__skills">
          <div>
            <p className="role-card__label">Matched Skills</p>
            <div className="tag-row">
              {matchedSkills.length > 0 ? (
                matchedSkills.slice(0, compact ? 2 : 4).map((skill) => (
                  <SkillTag key={skill} tone="success">
                    {skill}
                  </SkillTag>
                ))
              ) : (
                <SkillTag tone="neutral">No matched skills yet</SkillTag>
              )}
            </div>
          </div>

          <div>
            <p className="role-card__label">Skill Gaps</p>
            <div className="tag-row">
              {missingSkills.length > 0 ? (
                missingSkills.slice(0, compact ? 2 : 4).map((skill) => (
                  <SkillTag key={skill} tone="danger">
                    {skill}
                  </SkillTag>
                ))
              ) : (
                <SkillTag tone="success">No critical gaps</SkillTag>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="role-card__metrics">
        <MatchBadge value={role.matchPercentage} />
        <ProgressBar value={role.matchPercentage} />
      </div>

      <div className="role-card__actions">
        <button type="button" className="button button--ghost" onClick={onView}>
          {actionLabel}
        </button>
      </div>
    </article>
  );
}

export default RoleCard;

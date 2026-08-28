import MatchBadge from "./MatchBadge";
import ProgressBar from "./ProgressBar";
import SkillTag from "./SkillTag";

function JobCard({ job, onView }) {
  return (
    <article className="job-card">
      <div className="job-card__top">
        <div className="job-card__logo">{job.companyInitial}</div>
        <div>
          <h3>{job.jobTitle}</h3>
          <p>{job.company}</p>
        </div>
      </div>

      <div className="meta-row">
        <span>{job.location || "Location not specified"}</span>
        <span>{job.experienceLevel || "Experience not specified"}</span>
        <span>{job.employmentType || "Type not specified"}</span>
      </div>

      <div className="job-card__match">
        <MatchBadge value={job.matchPercentage} label="Your Match" />
        <ProgressBar value={job.matchPercentage} />
      </div>

      <div className="job-card__skills">
        <div>
          <p className="role-card__label">Matched</p>
          <div className="tag-row">
            {job.matchedSkills.length > 0 ? (
              job.matchedSkills.slice(0, 3).map((skill) => (
                <SkillTag key={skill} tone="success">
                  {skill}
                </SkillTag>
              ))
            ) : (
              <SkillTag tone="neutral">No matched skills</SkillTag>
            )}
          </div>
        </div>

        <div>
          <p className="role-card__label">Missing</p>
          <div className="tag-row">
            {job.missingSkills.length > 0 ? (
              job.missingSkills.slice(0, 3).map((skill) => (
                <SkillTag key={skill} tone="danger">
                  {skill}
                </SkillTag>
              ))
            ) : (
              <SkillTag tone="success">No missing skills</SkillTag>
            )}
          </div>
        </div>
      </div>

      <div className="job-card__footer">
        <span>
          {job.matchedSkills.length} matched of {job.totalRequiredSkills} skills
        </span>

        <button type="button" className="button button--ghost" onClick={onView}>
          View Job
        </button>
      </div>
    </article>
  );
}

export default JobCard;

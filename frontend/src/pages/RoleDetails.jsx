import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import JobCard from "../components/JobCard";
import MatchBadge from "../components/MatchBadge";
import PageHeader from "../components/PageHeader";
import SkillTag from "../components/SkillTag";
import StatusCard from "../components/StatusCard";
import {
  getJobMatch,
  getJobsForRole,
  getRecommendedRoles,
} from "../services/api";
import {
  collectSkillGaps,
  DEMO_USER_ID,
  normalizeJob,
  normalizeRole,
} from "../utils/careerData";

function RoleDetails() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoleDetails() {
      try {
        setLoading(true);
        setError("");

        const [rolesData, jobsData] = await Promise.all([
          getRecommendedRoles(DEMO_USER_ID),
          getJobsForRole(roleId),
        ]);

        const selectedRole = (rolesData?.recommendations || [])
          .map(normalizeRole)
          .find((item) => item.roleId === roleId);

        const jobList = jobsData?.jobs || [];
        const jobsWithMatch = await Promise.all(
          jobList.map(async (job) => {
            try {
              const match = await getJobMatch(DEMO_USER_ID, job.job_id);
              return normalizeJob(job, match);
            } catch (matchError) {
              console.error(matchError);
              return normalizeJob(job);
            }
          })
        );

        setRole(selectedRole || null);
        setJobs(jobsWithMatch);
      } catch (err) {
        console.error(err);
        setError("Unable to load role details.");
      } finally {
        setLoading(false);
      }
    }

    if (roleId) {
      loadRoleDetails();
    }
  }, [roleId]);

  const uniqueRequirements = useMemo(() => {
    const map = new Map();

    jobs.forEach((job) => {
      job.requirements.forEach((requirement) => {
        if (!map.has(requirement.name)) {
          map.set(requirement.name, requirement);
        }
      });
    });

    return [...map.values()];
  }, [jobs]);

  const aggregatedGaps = useMemo(
    () => collectSkillGaps(role ? [role] : []).slice(0, 6),
    [role]
  );

  if (loading) {
    return (
      <StatusCard
        type="loading"
        title="Loading role details..."
        description="We are pulling your role match and the jobs connected to it."
      />
    );
  }

  if (error || !role) {
    return (
      <StatusCard
        type="error"
        title="Unable to load this information."
        description={error || "The selected role could not be found."}
        action={
          <button type="button" className="button" onClick={() => navigate("/roles")}>
            Back to roles
          </button>
        }
      />
    );
  }

  return (
    <div className="content-page">
      <button type="button" className="button button--link" onClick={() => navigate("/roles")}>
        Back to roles
      </button>

      <section className="detail-hero">
        <div className="detail-hero__icon">{role.shortCode}</div>
        <div className="detail-hero__content">
          <PageHeader
            eyebrow="Career Role"
            title={role.role}
            description="Explore why this role matches your skills and which jobs are connected to it."
          />
        </div>
        <MatchBadge value={role.matchPercentage} label="Your Match" />
      </section>

      <div className="detail-grid">
        <main className="stack">
          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Your Match</h3>
                <p>What already aligns with this career path.</p>
              </div>
            </div>

            <div className="section-grid">
              <div className="info-card">
                <h4>Matched Skills</h4>
                <div className="tag-row">
                  {role.matchedSkills.map((skill) => (
                    <SkillTag key={skill} tone="success">
                      {skill}
                    </SkillTag>
                  ))}
                </div>
              </div>

              <div className="info-card">
                <h4>Skill Gaps</h4>
                <div className="tag-row">
                  {role.missingSkills.length > 0 ? (
                    role.missingSkills.map((skill) => (
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
          </section>

          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Job Opportunities</h3>
                <p>Jobs associated with this role and your current fit for each one.</p>
              </div>
              <div className="header-chip">{jobs.length} jobs</div>
            </div>

            {jobs.length === 0 ? (
              <StatusCard
                type="empty"
                title="No job postings found for this role."
                description="Try another recommended role to continue exploring opportunities."
                compact
              />
            ) : (
              <div className="stack">
                {jobs.map((job) => (
                  <JobCard
                    key={job.jobId}
                    job={job}
                    onView={() => navigate(`/jobs/${job.jobId}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        <aside className="dashboard-side">
          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Role Requirements</h3>
                <p>Skills frequently required by related jobs.</p>
              </div>
            </div>

            {uniqueRequirements.length === 0 ? (
              <StatusCard
                type="empty"
                title="No role requirements available."
                compact
              />
            ) : (
              <div className="requirement-list">
                {uniqueRequirements.map((requirement) => (
                  <div className="requirement-row" key={requirement.id}>
                    <div>
                      <strong>{requirement.name}</strong>
                      <p>{requirement.proficiency}</p>
                    </div>
                    <SkillTag
                      tone={requirement.importance === "high" ? "danger" : "warning"}
                    >
                      {requirement.importance}
                    </SkillTag>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Priority Skill Gaps</h3>
                <p>Skills to improve for this role.</p>
              </div>
            </div>

            <div className="gap-list">
              {aggregatedGaps.map((gap) => (
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

            <button
              type="button"
              className="button"
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

export default RoleDetails;

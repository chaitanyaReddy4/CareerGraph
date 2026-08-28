import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MatchBadge from "../components/MatchBadge";
import PageHeader from "../components/PageHeader";
import SkillTag from "../components/SkillTag";
import StatusCard from "../components/StatusCard";
import { getJobMatch } from "../services/api";
import {
  buildMatchExplanation,
  DEMO_USER_ID,
  normalizeJob,
} from "../utils/careerData";

function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        setError("");
        const data = await getJobMatch(DEMO_USER_ID, jobId);
        setJob(normalizeJob(null, data));
      } catch (err) {
        console.error(err);
        setError("Unable to load job details.");
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      loadJob();
    }
  }, [jobId]);

  if (loading) {
    return (
      <StatusCard
        type="loading"
        title="Loading job details..."
        description="We are calculating your fit for this specific job."
      />
    );
  }

  if (error || !job) {
    return (
      <StatusCard
        type="error"
        title="Unable to load this information."
        description={error || "This job posting could not be found."}
        action={
          <button type="button" className="button" onClick={() => navigate("/jobs")}>
            Back to jobs
          </button>
        }
      />
    );
  }

  return (
    <div className="content-page">
      <button type="button" className="button button--link" onClick={() => navigate("/jobs")}>
        Back to job postings
      </button>

      <section className="detail-hero">
        <div className="detail-hero__icon">{job.companyInitial}</div>
        <div className="detail-hero__content">
          <PageHeader
            eyebrow={job.role}
            title={job.jobTitle}
            description={`${job.company} / ${job.location || "Location not specified"}`}
          />
        </div>
        <MatchBadge value={job.matchPercentage} label="Your Match" />
      </section>

      <div className="detail-grid">
        <main className="stack">
          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Matched Skills</h3>
                <p>Skills you already bring to this opportunity.</p>
              </div>
            </div>
            <div className="tag-row">
              {job.matchedSkills.length > 0 ? (
                job.matchedSkills.map((skill) => (
                  <SkillTag key={skill} tone="success">
                    {skill}
                  </SkillTag>
                ))
              ) : (
                <SkillTag tone="neutral">No matched skills identified</SkillTag>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Skill Gaps</h3>
                <p>Requirements that still need attention.</p>
              </div>
            </div>
            <div className="tag-row">
              {job.missingSkills.length > 0 ? (
                job.missingSkills.map((skill) => (
                  <SkillTag key={skill} tone="danger">
                    {skill}
                  </SkillTag>
                ))
              ) : (
                <SkillTag tone="success">No missing skills</SkillTag>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Job Requirements</h3>
                <p>Required skills, priority, and current match status.</p>
              </div>
            </div>

            <div className="requirements-table">
              <div className="requirements-table__head">
                <span>Skill</span>
                <span>Importance</span>
                <span>Required Proficiency</span>
                <span>Status</span>
              </div>

              {job.requirements.map((requirement) => {
                const matched = job.matchedSkills.includes(requirement.name);

                return (
                  <div className="requirements-table__row" key={requirement.id}>
                    <span>{requirement.name}</span>
                    <span>{requirement.importance}</span>
                    <span>{requirement.proficiency}</span>
                    <span>{matched ? "Matched" : "Missing"}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        <aside className="dashboard-side">
          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Why this match?</h3>
                <p>Frontend summary based on the available match data.</p>
              </div>
            </div>
            <p className="body-copy">{buildMatchExplanation(job)}</p>
          </section>

          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Job Summary</h3>
                <p>Quick details for this opportunity.</p>
              </div>
            </div>
            <div className="summary-list">
              <div className="summary-list__row">
                <span>Company</span>
                <strong>{job.company}</strong>
              </div>
              <div className="summary-list__row">
                <span>Location</span>
                <strong>{job.location || "Not specified"}</strong>
              </div>
              <div className="summary-list__row">
                <span>Experience</span>
                <strong>{job.experienceLevel || "Not specified"}</strong>
              </div>
              <div className="summary-list__row">
                <span>Employment Type</span>
                <strong>{job.employmentType || "Not specified"}</strong>
              </div>
            </div>
          </section>

          <section className="panel panel--cta">
            <div className="panel__header">
              <div>
                <h3>Focus on these skills</h3>
                <p>Use your current gaps to build a more targeted development plan.</p>
              </div>
            </div>
            <button type="button" className="button" onClick={() => navigate("/career-focus")}>
              Go to Career Focus
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default JobDetails;

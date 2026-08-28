import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import JobCard from "../components/JobCard";
import PageHeader from "../components/PageHeader";
import StatusCard from "../components/StatusCard";
import {
  getJobMatch,
  getJobsForRole,
  getRecommendedRoles,
} from "../services/api";
import {
  DEMO_USER_ID,
  normalizeJob,
  normalizeRole,
} from "../utils/careerData";

function JobPostings() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoles() {
      try {
        setLoadingRoles(true);
        setError("");
        const data = await getRecommendedRoles(DEMO_USER_ID);
        const recommendations = (data?.recommendations || [])
          .map(normalizeRole)
          .sort((left, right) => right.matchPercentage - left.matchPercentage);

        setRoles(recommendations);
        setSelectedRoleId(recommendations[0]?.roleId || "");
      } catch (err) {
        console.error(err);
        setError("Unable to load recommended roles.");
      } finally {
        setLoadingRoles(false);
      }
    }

    loadRoles();
  }, []);

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoadingJobs(true);
        setError("");
        const data = await getJobsForRole(selectedRoleId);
        const jobList = data?.jobs || [];
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

        setJobs(jobsWithMatch);
      } catch (err) {
        console.error(err);
        setJobs([]);
        setError("Unable to load job postings.");
      } finally {
        setLoadingJobs(false);
      }
    }

    if (selectedRoleId) {
      loadJobs();
    }
  }, [selectedRoleId]);

  const selectedRole = roles.find((role) => role.roleId === selectedRoleId);

  if (loadingRoles) {
    return (
      <StatusCard
        type="loading"
        title="Finding your recommended roles..."
        description="We need your available role matches before we can load related jobs."
      />
    );
  }

  if (error && roles.length === 0) {
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
        eyebrow="Career Opportunities"
        title="Job Postings"
        description="Explore jobs connected to the career roles that match your current skills."
      />

      {roles.length === 0 ? (
        <StatusCard
          type="empty"
          title="No career recommendations available yet."
          description="Once roles are available, job postings will appear here."
        />
      ) : (
        <>
          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Select a Role</h3>
                <p>Switch roles to view jobs specifically associated with each one.</p>
              </div>
            </div>

            <div className="role-tabs">
              {roles.map((role) => (
                <button
                  key={role.roleId}
                  type="button"
                  className={`role-tab ${selectedRoleId === role.roleId ? "is-active" : ""}`}
                  onClick={() => setSelectedRoleId(role.roleId)}
                >
                  <span>{role.role}</span>
                  <strong>{role.matchPercentage}%</strong>
                </button>
              ))}
            </div>
          </section>

          {selectedRole ? (
            <section className="selected-summary">
              <div>
                <p className="page-header__eyebrow">Current Target Role</p>
                <h3>{selectedRole.role}</h3>
                <p className="selected-summary__text">
                  {selectedRole.matchedSkillsCount} of {selectedRole.totalRequiredSkills} role
                  skills currently matched.
                </p>
              </div>
              <div className="header-chip">{selectedRole.matchPercentage}% current match</div>
            </section>
          ) : null}

          {error ? (
            <StatusCard
              type="error"
              title="Unable to load this information."
              description={error}
              compact
            />
          ) : null}

          <section className="panel">
            <div className="panel__header">
              <div>
                <h3>Available Jobs</h3>
                <p>Jobs associated with the selected role.</p>
              </div>
              <div className="header-chip">{jobs.length} jobs</div>
            </div>

            {loadingJobs ? (
              <StatusCard
                type="loading"
                title={`Finding jobs for ${selectedRole?.role || "this role"}...`}
                compact
              />
            ) : jobs.length === 0 ? (
              <StatusCard
                type="empty"
                title="No job postings found for this role."
                description="Try another recommended role to explore additional opportunities."
                compact
              />
            ) : (
              <div className="job-grid">
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
        </>
      )}
    </div>
  );
}

export default JobPostings;

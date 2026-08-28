export const DEMO_USER_ID = "user-demo";

export function normalizeRole(role) {
  const title = role?.role || "Untitled Role";

  return {
    roleId: role?.role_id || title,
    role: title,
    category: "Technology / Software Development",
    shortCode: title
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join(""),
    matchPercentage: Number(role?.match_percentage) || 0,
    matchedSkills: role?.matchedSkills || role?.matched_skills_list || [],
    missingSkills: role?.missingSkills || role?.missing_skills || [],
    matchedSkillsCount: Number(role?.matched_skills) || 0,
    totalRequiredSkills: Number(role?.total_required_skills) || 0,
  };
}

export function normalizeRequirement(requirement) {
  const name =
    requirement?.name || requirement?.skill || requirement?.skill_name || "Skill";

  return {
    id: requirement?.id || requirement?.skill_id || name,
    name,
    importance: requirement?.importance || "medium",
    proficiency:
      requirement?.proficiency || requirement?.required_proficiency || "Required",
  };
}

export function normalizeJob(job, match = null) {
  const requirements = (match?.requirements || job?.requirements || []).map(
    normalizeRequirement
  );
  const matchedSkills = match?.matched_skills_list || [];
  const missingSkills = match?.missing_skills || [];

  return {
    jobId: job?.job_id || match?.job_id,
    roleId: job?.role_id || match?.role_id,
    role: job?.role || match?.role || "Career Opportunity",
    jobTitle: job?.job_title || match?.job_title || "Untitled Job",
    company: job?.company || match?.company || "Unknown Company",
    companyId: job?.company_id || match?.company_id || "company",
    companyInitial: (job?.company || match?.company || "C")
      .charAt(0)
      .toUpperCase(),
    location: job?.location || match?.location || "",
    experienceLevel: job?.experience_level || match?.experience_level || "",
    employmentType: job?.employment_type || match?.employment_type || "",
    matchPercentage: Number(match?.match_percentage) || 0,
    matchedSkillsCount: Number(match?.matched_skills) || matchedSkills.length,
    totalRequiredSkills:
      Number(match?.total_required_skills) || requirements.length,
    matchedSkills,
    missingSkills,
    requirements,
  };
}

export function collectSkillGaps(roles) {
  const counts = new Map();

  roles.forEach((role) => {
    role.missingSkills.forEach((skill) => {
      counts.set(skill, (counts.get(skill) || 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([skill, count], index) => ({
      skill,
      count,
      priority: count >= 2 || index < 3 ? "High Priority" : "Medium Priority",
      reason:
        count >= 2
          ? `Required across ${count} recommended roles.`
          : "Shows up as a gap in your current target path.",
    }));
}

export function buildMatchExplanation(job) {
  if (job.matchPercentage >= 70) {
    return "You already cover most of this role's required skills, with only a few focused gaps remaining.";
  }

  if (job.matchPercentage >= 40) {
    return "You have a solid foundation for this job, but closing the listed skill gaps would improve readiness quickly.";
  }

  return "This job is still reachable, but it depends on building the missing technical requirements first.";
}

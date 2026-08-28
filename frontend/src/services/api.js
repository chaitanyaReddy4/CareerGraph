const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

async function request(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API request failed");
  }

  return response.json();
}

export async function getRecommendedRoles(userId) {
  return request(`/users/${userId}/recommended-roles`);
}

export async function getJobsForRole(roleId) {
  return request(`/roles/${roleId}/jobs`);
}

export async function getJobMatch(userId, jobId) {
  return request(`/jobs/${jobId}/match?user_id=${userId}`);
}

export async function getSkillDemand(roleId) {
  return request(`/roles/${roleId}/skill-demand`);
}
from app.database.driver import driver


SKILL_DEMAND_QUERY = """
MATCH (r:Role {id: $role_id})
MATCH (j:JobPosting)-[:FOR_ROLE]->(r)

WITH
    r,
    collect(DISTINCT j) AS jobs

WITH
    r,
    jobs,
    size(jobs) AS totalJobs

UNWIND jobs AS job

MATCH (job)-[:REQUIRES]->(s:Skill)

WITH
    r,
    totalJobs,
    s,
    count(DISTINCT job) AS jobsRequiringSkill

RETURN
    r.id AS role_id,
    r.title AS role,
    s.id AS skill_id,
    s.name AS skill,
    jobsRequiringSkill AS jobs_requiring,
    totalJobs AS total_jobs,

    round(
        100.0 * jobsRequiringSkill / totalJobs
    ) AS demand_percentage

ORDER BY
    demand_percentage DESC,
    skill
"""


def get_skill_demand(role_id: str):
    with driver.session() as session:
        result = session.run(
            SKILL_DEMAND_QUERY,
            role_id=role_id,
        )

        return [record.data() for record in result]
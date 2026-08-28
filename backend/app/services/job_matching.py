from app.database.driver import driver


ROLE_JOBS_QUERY = """
MATCH (r:Role {id: $role_id})
MATCH (j:JobPosting)-[:FOR_ROLE]->(r)
MATCH (j)-[:OFFERED_BY]->(c:Company)

OPTIONAL MATCH (j)-[req:REQUIRES]->(s:Skill)

WITH
    r,
    j,
    c,
    collect({
        skill_id: s.id,
        skill: s.name,
        importance: req.importance,
        proficiency: req.proficiency
    }) AS requirements

RETURN
    r.id AS role_id,
    r.title AS role,
    j.id AS job_id,
    j.title AS job_title,
    c.id AS company_id,
    c.name AS company,
    j.location AS location,
    j.experience_level AS experience_level,
    j.employment_type AS employment_type,
    requirements
ORDER BY company
"""


def get_jobs_for_role(role_id: str):
    with driver.session() as session:
        result = session.run(
            ROLE_JOBS_QUERY,
            role_id=role_id,
        )

        return [record.data() for record in result]
JOB_MATCH_QUERY = """
MATCH (u:User {id: $user_id})
OPTIONAL MATCH (u)-[has:HAS_SKILL]->(userSkill:Skill)
WITH
    u,
    [skill IN collect({
        id: userSkill.id,
        proficiency: has.proficiency
    }) WHERE skill.id IS NOT NULL] AS userSkills

MATCH (j:JobPosting {id: $job_id})
MATCH (j)-[:OFFERED_BY]->(c:Company)
MATCH (j)-[req:REQUIRES]->(requiredSkill:Skill)

WITH
    j,
    c,
    userSkills,
    collect({
        id: requiredSkill.id,
        name: requiredSkill.name,
        importance: req.importance,
        proficiency: req.proficiency
    }) AS requirements

WITH
    j,
    c,
    requirements,
    userSkills,

    [x IN requirements
     WHERE any(u IN userSkills WHERE u.id = x.id)
    ] AS matchedRequirements,

    [x IN requirements
     WHERE NOT any(u IN userSkills WHERE u.id = x.id)
    ] AS missingRequirements

WITH
    j,
    c,
    requirements,
    matchedRequirements,
    missingRequirements,

    reduce(
        total = 0.0,
        x IN requirements |
        total +
        CASE x.importance
            WHEN "high" THEN 3.0
            WHEN "medium" THEN 2.0
            WHEN "low" THEN 1.0
            ELSE 1.0
        END
    ) AS totalWeight,

    reduce(
        earned = 0.0,
        x IN matchedRequirements |
        earned +
        CASE x.importance
            WHEN "high" THEN 3.0
            WHEN "medium" THEN 2.0
            WHEN "low" THEN 1.0
            ELSE 1.0
        END
        *
        CASE
            WHEN head([
                u IN userSkills
                WHERE u.id = x.id
            ]).proficiency = "advanced"
                THEN 1.0

            WHEN head([
                u IN userSkills
                WHERE u.id = x.id
            ]).proficiency = "intermediate"
                THEN 0.75

            WHEN head([
                u IN userSkills
                WHERE u.id = x.id
            ]).proficiency = "beginner"
                THEN 0.50

            ELSE 0.0
        END
    ) AS earnedWeight

RETURN
    j.id AS job_id,
    j.title AS job_title,
    c.id AS company_id,
    c.name AS company,
    j.location AS location,

    size(requirements) AS total_required_skills,
    size(matchedRequirements) AS matched_skills,

    round(
        100.0 * earnedWeight / totalWeight
    ) AS match_percentage,

    [x IN matchedRequirements | x.name]
        AS matched_skills_list,

    [x IN missingRequirements | x.name]
        AS missing_skills,

    requirements
"""


def get_job_match(user_id: str, job_id: str):
    with driver.session() as session:
        result = session.run(
            JOB_MATCH_QUERY,
            user_id=user_id,
            job_id=job_id,
        )

        record = result.single()

        if not record:
            return None

        return record.data()

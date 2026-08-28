from app.database.driver import driver


ROLE_MATCH_QUERY = """
MATCH (u:User {id: $user_id})-[has:HAS_SKILL]->(userSkill:Skill)

WITH
    collect({
        id: userSkill.id,
        proficiency: has.proficiency
    }) AS userSkills

MATCH (r:Role)-[req:COMMONLY_REQUIRES]->(requiredSkill:Skill)

WITH
    r,
    requiredSkill,
    req,
    userSkills,

    CASE req.importance
        WHEN "high" THEN 3.0
        WHEN "medium" THEN 2.0
        WHEN "low" THEN 1.0
        ELSE 1.0
    END AS requirementWeight

WITH
    r,
    requiredSkill,
    requirementWeight,
    userSkills,

    [x IN userSkills WHERE x.id = requiredSkill.id] AS directMatch

WITH
    r,
    requiredSkill,
    requirementWeight,

    CASE
        WHEN size(directMatch) > 0
        THEN
            requirementWeight *
            CASE directMatch[0].proficiency
                WHEN "advanced" THEN 1.0
                WHEN "intermediate" THEN 0.75
                WHEN "beginner" THEN 0.50
                ELSE 0.0
            END
        ELSE 0.0
    END AS earnedWeight

WITH
    r,
    collect({
        skill: requiredSkill.name,
        weight: requirementWeight,
        earned: earnedWeight
    }) AS skillResults,
    sum(requirementWeight) AS totalWeight,
    sum(earnedWeight) AS earnedWeight

WITH
    r,
    skillResults,
    totalWeight,
    earnedWeight,

    [x IN skillResults WHERE x.earned > 0 | x.skill]
        AS matchedSkills,

    [x IN skillResults WHERE x.earned = 0 | x.skill]
        AS missingSkills

RETURN
    r.id AS role_id,
    r.title AS role,
    size(skillResults) AS total_required_skills,
    size(matchedSkills) AS matched_skills,

    round(
        100.0 * earnedWeight / totalWeight
    ) AS match_percentage,

    matchedSkills,
    missingSkills

ORDER BY match_percentage DESC
"""


def get_role_recommendations(user_id: str):
    with driver.session() as session:
        result = session.run(
            ROLE_MATCH_QUERY,
            user_id=user_id,
        )

        return [record.data() for record in result]
import json
from pathlib import Path

from app.database.driver import driver


DATA_DIR = Path(__file__).parent / "data"


def load_json(filename):
    path = DATA_DIR / filename

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def create_constraints(session):
    queries = [
        """
        CREATE CONSTRAINT user_id_unique IF NOT EXISTS
        FOR (u:User)
        REQUIRE u.id IS UNIQUE
        """,
        """
        CREATE CONSTRAINT skill_id_unique IF NOT EXISTS
        FOR (s:Skill)
        REQUIRE s.id IS UNIQUE
        """,
        """
        CREATE CONSTRAINT role_id_unique IF NOT EXISTS
        FOR (r:Role)
        REQUIRE r.id IS UNIQUE
        """,
        """
        CREATE CONSTRAINT job_id_unique IF NOT EXISTS
        FOR (j:JobPosting)
        REQUIRE j.id IS UNIQUE
        """,
        """
        CREATE CONSTRAINT company_id_unique IF NOT EXISTS
        FOR (c:Company)
        REQUIRE c.id IS UNIQUE
        """,
        """
        CREATE CONSTRAINT project_id_unique IF NOT EXISTS
        FOR (p:Project)
        REQUIRE p.id IS UNIQUE
        """,
        """
        CREATE CONSTRAINT course_id_unique IF NOT EXISTS
        FOR (c:Course)
        REQUIRE c.id IS UNIQUE
        """
    ]

    for query in queries:
        session.run(query)


def seed_skills(session, skills):
    query = """
    UNWIND $skills AS skill
    MERGE (s:Skill {id: skill.id})
    SET
        s.name = skill.name,
        s.category = skill.category,
        s.difficulty = skill.difficulty
    """

    session.run(query, skills=skills)


def seed_roles(session, roles):
    query = """
    UNWIND $roles AS role
    MERGE (r:Role {id: role.id})
    SET
        r.title = role.title,
        r.category = role.category,
        r.description = role.description
    """

    session.run(query, roles=roles)


def seed_companies(session, companies):
    query = """
    UNWIND $companies AS company
    MERGE (c:Company {id: company.id})
    SET
        c.name = company.name,
        c.industry = company.industry,
        c.location = company.location
    """

    session.run(query, companies=companies)


def seed_user(session):
    query = """
    MERGE (u:User {id: $user_id})
    SET u.name = $name

    WITH u

    UNWIND $skills AS skill_data

    MATCH (s:Skill {id: skill_data.skill_id})

    MERGE (u)-[r:HAS_SKILL]->(s)
    SET r.proficiency = skill_data.proficiency
    """

    session.run(
        query,
        user_id="user-demo",
        name="Demo User",
        skills=[
            {
                "skill_id": "python",
                "proficiency": "advanced"
            },
            {
                "skill_id": "sql",
                "proficiency": "intermediate"
            },
            {
                "skill_id": "react",
                "proficiency": "intermediate"
            },
            {
                "skill_id": "mongodb",
                "proficiency": "intermediate"
            },
            {
                "skill_id": "git",
                "proficiency": "intermediate"
            }
        ],
    )


def seed_skill_relationships(session):
    relationships = [
        ("python", "fastapi", 0.90),
        ("python", "flask", 0.85),
        ("python", "django", 0.85),
        ("python", "pandas", 0.80),
        ("python", "numpy", 0.80),
        ("python", "scikit-learn", 0.80),

        ("javascript", "react", 0.95),
        ("javascript", "nodejs", 0.90),
        ("javascript", "expressjs", 0.85),
        ("javascript", "nextjs", 0.85),

        ("react", "nextjs", 0.90),
        ("react", "typescript", 0.80),

        ("sql", "postgresql", 0.90),
        ("sql", "mysql", 0.90),

        ("nodejs", "expressjs", 0.90),

        ("docker", "kubernetes", 0.80),
        ("aws", "docker", 0.70),
        ("aws", "kubernetes", 0.80),

        ("pandas", "numpy", 0.85),
        ("machine-learning", "scikit-learn", 0.90),
        ("machine-learning", "tensorflow", 0.75),
        ("machine-learning", "pytorch", 0.75),

        ("deep-learning", "tensorflow", 0.90),
        ("deep-learning", "pytorch", 0.90)
    ]

    query = """
    UNWIND $relationships AS rel

    MATCH (source:Skill {id: rel.source})
    MATCH (target:Skill {id: rel.target})

    MERGE (source)-[r:RELATED_TO]->(target)
    SET r.strength = rel.strength
    """

    session.run(
        query,
        relationships=[
            {
                "source": source,
                "target": target,
                "strength": strength
            }
            for source, target, strength in relationships
        ],
    )


def seed_prerequisites(session):
    relationships = [
        ("javascript", "nodejs"),
        ("nodejs", "expressjs"),
        ("python", "fastapi"),
        ("python", "flask"),
        ("sql", "postgresql"),
        ("sql", "mysql"),
        ("docker", "kubernetes"),
        ("numpy", "pandas"),
        ("pandas", "machine-learning"),
        ("machine-learning", "deep-learning")
    ]

    query = """
    UNWIND $relationships AS rel

    MATCH (source:Skill {id: rel.source})
    MATCH (target:Skill {id: rel.target})

    MERGE (source)-[:PREREQUISITE_OF]->(target)
    """

    session.run(
        query,
        relationships=[
            {
                "source": source,
                "target": target
            }
            for source, target in relationships
        ],
    )


def seed_jobs(session, jobs):
    query = """
    UNWIND $jobs AS job

    MERGE (j:JobPosting {id: job.id})
    SET
        j.title = job.title,
        j.description = job.description,
        j.location = job.location,
        j.experience_level = job.experience_level,
        j.employment_type = job.employment_type

    WITH j, job

    MATCH (r:Role {id: job.role_id})
    MERGE (j)-[:FOR_ROLE]->(r)

    WITH j, job

    MATCH (c:Company {id: job.company_id})
    MERGE (j)-[:OFFERED_BY]->(c)

    WITH j, job

    UNWIND job.requirements AS requirement

    MATCH (s:Skill {id: requirement.skill_id})

    MERGE (j)-[req:REQUIRES]->(s)
    SET
        req.importance = requirement.importance,
        req.proficiency = requirement.proficiency
    """

    session.run(query, jobs=jobs)


def seed_role_requirements(session):
    role_requirements = {
        "frontend-developer": [
            ("html", "high"),
            ("css", "high"),
            ("javascript", "high"),
            ("react", "high"),
            ("git", "medium"),
            ("typescript", "medium")
        ],
        "backend-developer": [
            ("python", "high"),
            ("sql", "high"),
            ("rest-api", "high"),
            ("git", "medium"),
            ("docker", "medium")
        ],
        "full-stack-developer": [
            ("javascript", "high"),
            ("react", "high"),
            ("nodejs", "high"),
            ("sql", "medium"),
            ("git", "medium"),
            ("rest-api", "high")
        ],
        "python-developer": [
            ("python", "high"),
            ("sql", "medium"),
            ("rest-api", "medium"),
            ("git", "medium")
        ],
        "data-analyst": [
            ("sql", "high"),
            ("excel", "high"),
            ("statistics", "medium"),
            ("powerbi", "medium"),
            ("python", "medium")
        ],
        "data-scientist": [
            ("python", "high"),
            ("pandas", "high"),
            ("numpy", "high"),
            ("statistics", "high"),
            ("machine-learning", "high"),
            ("scikit-learn", "high")
        ],
        "ml-engineer": [
            ("python", "high"),
            ("numpy", "high"),
            ("pandas", "high"),
            ("machine-learning", "high"),
            ("scikit-learn", "high"),
            ("docker", "medium")
        ],
        "devops-engineer": [
            ("linux", "high"),
            ("docker", "high"),
            ("kubernetes", "medium"),
            ("aws", "high"),
            ("cicd", "high"),
            ("git", "medium")
        ],
                "software-engineer": [
            ("python", "high"),
            ("javascript", "high"),
            ("sql", "high"),
            ("rest-api", "high"),
            ("git", "medium")
        ],

        "data-engineer": [
            ("python", "high"),
            ("sql", "high"),
            ("postgresql", "medium"),
            ("pandas", "medium"),
            ("docker", "medium"),
            ("git", "medium")
        ],

        "ai-engineer": [
            ("python", "high"),
            ("machine-learning", "high"),
            ("deep-learning", "high"),
            ("nlp", "medium"),
            ("docker", "medium"),
            ("git", "medium")
        ],

        "cloud-engineer": [
            ("linux", "high"),
            ("docker", "high"),
            ("aws", "high"),
            ("git", "medium"),
            ("cicd", "high")
        ],

        "database-developer": [
            ("sql", "high"),
            ("mysql", "high"),
            ("postgresql", "high"),
            ("git", "medium")
        ],
    }

    query = """
    UNWIND $requirements AS requirement

    MATCH (r:Role {id: requirement.role_id})
    MATCH (s:Skill {id: requirement.skill_id})

    MERGE (r)-[rel:COMMONLY_REQUIRES]->(s)
    SET rel.importance = requirement.importance
    """

    data = []

    for role_id, requirements in role_requirements.items():
        for skill_id, importance in requirements:
            data.append(
                {
                    "role_id": role_id,
                    "skill_id": skill_id,
                    "importance": importance
                }
            )

    session.run(query, requirements=data)


def run_seed():
    skills = load_json("skills.json")
    roles = load_json("roles.json")
    companies = load_json("companies.json")
    jobs = load_json("jobs.json")

    with driver.session() as session:
        print("Creating constraints...")
        create_constraints(session)

        print("Seeding skills...")
        seed_skills(session, skills)

        print("Seeding roles...")
        seed_roles(session, roles)

        print("Seeding companies...")
        seed_companies(session, companies)

        print("Seeding user...")
        seed_user(session)

        print("Creating skill relationships...")
        seed_skill_relationships(session)

        print("Creating prerequisite relationships...")
        seed_prerequisites(session)

        print("Seeding jobs...")
        seed_jobs(session, jobs)

        print("Creating role requirements...")
        seed_role_requirements(session)

    print("CareerGraph seed completed successfully.")


if __name__ == "__main__":
    run_seed()
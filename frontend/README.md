# CareerGraph

CareerGraph is a career intelligence and job-matching platform that connects a user's skills with suitable career roles and job opportunities.

The system models relationships between **users, skills, career roles, job postings, and companies** using a graph database. It calculates role compatibility from the user's current skills, identifies missing skills, maps recommended roles to relevant job postings, and evaluates the user's skill match against individual jobs.

---

## Overview

CareerGraph follows a skill-driven career discovery workflow:

```text
User Skills
     │
     ▼
Role Matching
     │
     ▼
Recommended Career Roles
     │
     ├───────────────┐
     ▼               ▼
Skill Gap Analysis  Role-specific Jobs
                         │
                         ▼
                    Job Matching
                         │
                         ▼
                 Job Skill Gaps
                         │
                         ▼
                   Career Focus

Instead of treating career recommendations and job search as separate features, CareerGraph connects them through the same skill and role relationships.

Core Capabilities
1. Skill-Based Role Recommendation

The system compares a user's current skills against the skills required by different career roles.

For every role, CareerGraph calculates:

Required skills
Matched skills
Missing skills
Match percentage

Example:

Python Developer
Match: 67%

Matched:
- Python
- SQL
- Git

Missing:
- REST API

The recommendations are ranked by compatibility with the user's current skill set.

2. Graph-Based Career Model

CareerGraph uses a graph-oriented data model to represent relationships between entities.

The core entities include:

User
Skill
Role
JobPosting
Company

Important relationships include:

(User)-[:HAS_SKILL]->(Skill)

(JobPosting)-[:FOR_ROLE]->(Role)

(JobPosting)-[:OFFERED_BY]->(Company)

(JobPosting)-[:REQUIRES]->(Skill)

This structure allows the application to traverse relationships between a user's skills, career roles, required skills, and job opportunities.

3. Skill Gap Analysis

For each recommended role, the system identifies the skills that the user does not currently have.

For example:

Backend Developer
Match: 52%

Matched:
- Python
- SQL
- Git

Skill Gaps:
- REST API
- Docker

CareerGraph also aggregates skill gaps across recommended roles to identify skills that are repeatedly required across the user's potential career paths.

4. Role-to-Job Mapping

Each career role can have multiple job postings associated with it.

The relationship is represented as:

Role
 │
 ├── Job Posting
 ├── Job Posting
 ├── Job Posting
 └── Job Posting

This allows the user to move from:

Recommended Role
       ↓
Role Details
       ↓
Associated Job Postings
       ↓
Individual Job

The current seeded dataset provides job postings for all 13 career roles used by the recommendation system.

5. Job-Level Skill Matching

CareerGraph does not stop at role matching.

For an individual job posting, the system compares the user's skills against the skills required by that specific job.

Job requirements have an importance level:

high
medium
low

The matching calculation assigns different weights to these requirements.

Skill proficiency also affects the earned match score:

Advanced      → 100% of skill weight
Intermediate  → 75% of skill weight
Beginner      → 50% of skill weight

The resulting score represents the user's compatibility with the individual job.

Conceptually:

Job Match
    =
Weighted matched skill score
-----------------------------
Total required skill weight

This produces a more meaningful job-level match than simply counting matching technologies.

Technical Architecture
                         CareerGraph
                              │
             ┌────────────────┴────────────────┐
             │                                 │
        React Frontend                    FastAPI Backend
             │                                 │
             │                         Application Services
             │                                 │
             │                    ┌────────────┴────────────┐
             │                    │                         │
             │              Role Matching             Job Matching
             │                    │                         │
             └────────────────────┴────────────┬────────────┘
                                              │
                                              ▼
                                      CognoDB / Neo4j
                                      Graph Database
Frontend
React
Vite
JavaScript
React Router
CSS
Backend
Python
FastAPI
Graph-based service layer
Database
CognoDB / Neo4j-compatible graph database
Cypher queries
Development Tools
Git
GitHub
npm
Python virtual environment
Application Structure
CareerGraph/
│
├── backend/
│   ├── app/
│   │   ├── database/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── seed/
│   │   ├── data/
│   │   │   └── jobs.json
│   │   └── seed_data.py
│   │
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore
Backend Services

The backend separates application logic into service-level operations.

Role Matching

The role recommendation service evaluates the user's skills against role requirements and returns ranked recommendations.

The response contains information such as:

{
  "role_id": "python-developer",
  "role": "Python Developer",
  "total_required_skills": 4,
  "matched_skills": 3,
  "match_percentage": 67,
  "matchedSkills": [
    "Python",
    "SQL",
    "Git"
  ],
  "missingSkills": [
    "REST API"
  ]
}
Job Retrieval

Jobs associated with a role are retrieved through the graph relationship:

MATCH (r:Role {id: $role_id})
MATCH (j:JobPosting)-[:FOR_ROLE]->(r)
MATCH (j)-[:OFFERED_BY]->(c:Company)

The service returns:

Job ID
Job title
Company
Location
Experience level
Employment type
Required skills
Skill importance
Required proficiency
Job Matching

The job matching service:

Loads the requested user.
Retrieves the user's skills and proficiency levels.
Loads the selected job.
Retrieves the job's required skills.
Separates matched and missing requirements.
Calculates weighted required-skill totals.
Calculates the user's earned skill weight.
Produces the final match percentage.

The service also validates that the requested user exists before calculating a match.

API Flow
Recommended Roles
GET /api/users/{user_id}/recommended-roles

Returns career roles ranked according to the user's current skills.

Jobs for a Role
GET /api/roles/{role_id}/jobs

Returns job postings associated with a specific career role.

Job Match
GET /api/jobs/{job_id}/match?user_id={user_id}

Calculates the user's skill compatibility with an individual job posting.

Health Check
GET /api/health

Used to verify that the backend and graph database connection are available.

The database connection uses a bounded connection timeout so an unavailable database does not cause an indefinitely hanging health request.

Error Handling

The backend provides controlled responses for invalid resources.

Examples include:

Invalid role      → 404
Invalid job       → 404
Unknown user      → 404

The job matching service also prevents an unknown user from being interpreted as a valid user with a 0% match.

Seed Data

CareerGraph includes a deterministic demo dataset used to populate the graph database.

The seeded data contains:

Career roles
Skills
Companies
Users
Role-skill relationships
Skill prerequisite relationships
Job postings
Job requirements
Job-to-role relationships
Job-to-company relationships

The current recommendation system contains 13 career roles, with job postings mapped to all 13 roles.

Running the Project
Prerequisites

Install:

Python 3.x
Node.js
npm
CognoDB / Neo4j-compatible graph database
1. Clone the repository
git clone <your-repository-url>
cd CareerGraph
2. Backend Setup
cd backend

Create and activate a virtual environment.

Windows:

python -m venv .venv
.\.venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Configure the required database environment variables.

Example:

NEO4J_URI=
NEO4J_USERNAME=
NEO4J_PASSWORD=

Do not commit actual credentials.

3. Seed the Database

From the backend directory:

python -m seed.seed_data

Expected output includes operations such as:

Creating constraints...
Seeding skills...
Seeding roles...
Seeding companies...
Seeding user...
Creating skill relationships...
Creating prerequisite relationships...
Seeding jobs...
Creating role requirements...
CareerGraph seed completed successfully.
4. Start the Backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Health check:

http://127.0.0.1:8000/api/health
5. Start the Frontend

Open another terminal:

cd frontend
npm install
npm run dev

The Vite development server will provide the local frontend URL.

Frontend Routes

The application currently contains:

/                       Overview

/roles                  Recommended Roles

/roles/:roleId          Role Details

/jobs                   Job Postings

/jobs/:jobId            Job Details

/career-focus           Career Focus

/skills                 User Skills

/profile                User Profile
Verification

The current implementation has been validated with:

npm run lint
npm run build

Backend verification includes:

FastAPI health check
Database connectivity
Recommended role retrieval
Job retrieval for all 13 roles
Job matching
Invalid role handling
Invalid job handling
Invalid user handling
Python compilation

The current seeded dataset has been verified to provide job postings for all 13 career roles.

Example CareerGraph Flow

For a user with:

Python
SQL
Git
React

the system can produce:

                 User Skills
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
 Python Developer  Backend      Software
      67%         Developer     Engineer
                    52%           48%
        │            │             │
        ▼            ▼             ▼
    REST API      REST API       JavaScript
                  Docker         REST API

The user can then select a role and inspect real seeded job postings associated with that role.

At the individual job level, CareerGraph calculates a separate skill match based on the requirements of that specific posting.

This creates a progression from:

"What roles fit my skills?"
            ↓
"What jobs exist for those roles?"
            ↓
"How well do I match this job?"
            ↓
"What skills should I develop?"
Design Approach

CareerGraph is intentionally structured around relationship-driven career intelligence rather than a simple job listing system.

The graph model makes it possible to connect:

Users
  ↕
Skills
  ↕
Roles
  ↕
Jobs
  ↕
Companies

This structure provides a foundation for future capabilities such as:

Job-description based matching
Personalized career paths
Skill prerequisite traversal
Role transition recommendations
Skill demand analysis
Learning-path recommendations
Job recommendation ranking

These are potential extensions and are not required for the current implementation.

Future Enhancements

Possible future improvements include:

Job Description Matching

Allow users to paste a job description and calculate compatibility against their current skills.

Job Description
       ↓
Skill Extraction
       ↓
User Skill Comparison
       ↓
Match Score
       ↓
Missing Skills
Career Path Recommendations

Use role and prerequisite relationships to recommend paths from a user's current skill set toward a target role.

Skill Demand Analysis

Analyze job requirements to identify frequently requested technologies across companies and roles.

Personalized Learning Paths

Convert identified skill gaps into ordered learning priorities using skill prerequisite relationships.

Project Status

CareerGraph currently provides a working end-to-end implementation of:

User Skills
      ↓
Career Role Matching
      ↓
Skill Gap Analysis
      ↓
Role-specific Job Discovery
      ↓
Job-level Skill Matching
      ↓
Career Focus

The core application, seeded graph data, API integrations, and frontend workflow have been implemented and validated.


github:

https://github.com/chaitanyaReddy4/CareerGraph.git
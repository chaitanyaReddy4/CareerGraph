# CareerGraph

> A graph-powered career intelligence platform that connects a user's skills with suitable career roles, relevant job opportunities, companies, and skill gaps.

CareerGraph helps users understand:

- Which career roles match their current skills
- Which skills they already have
- Which skills they are missing
- Which jobs are available for a selected career role
- How well they match a specific job
- Which skills they should focus on developing next

---

## 📌 Overview

Traditional job platforms usually focus on searching and filtering job listings.

CareerGraph takes a different approach.

It starts with the user's **current skills** and builds a path from:

```text
Current Skills
      │
      ▼
Career Role Matching
      │
      ▼
Recommended Roles
      │
      ├──────────────► Skill Gap Analysis
      │
      ▼
Role-Specific Jobs
      │
      ▼
Individual Job Matching
      │
      ▼
Job Skill Gaps
      │
      ▼
Career Focus

The system uses a graph database to represent relationships between users, skills, career roles, job postings, and companies.

🎯 Problem Statement

A candidate may know several technologies but still not know:

"What roles am I currently suitable for?"

"What jobs can I apply for?"

"What skills am I missing?"

"Which skill should I learn next?"

"Which career path should I focus on?"

CareerGraph addresses these questions by connecting a user's skills to career roles and then connecting those roles to actual job requirements.

💡 Core Idea

CareerGraph treats career information as a connected graph instead of isolated records.

                         ┌───────────────┐
                         │     USER      │
                         └───────┬───────┘
                                 │
                              HAS_SKILL
                                 │
                                 ▼
                         ┌───────────────┐
                         │     SKILL     │
                         └───────┬───────┘
                                 │
                         required / supports
                                 │
                                 ▼
                         ┌───────────────┐
                         │     ROLE      │
                         └───────┬───────┘
                                 │
                               FOR_ROLE
                                 │
                                 ▼
                         ┌───────────────┐
                         │  JOB POSTING  │
                         └───────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                 REQUIRES                 OFFERED_BY
                    │                         │
                    ▼                         ▼
             ┌───────────────┐       ┌───────────────┐
             │     SKILL     │       │    COMPANY    │
             └───────────────┘       └───────────────┘

This structure allows CareerGraph to traverse relationships naturally.

🚀 Key Features
1. Skill-Based Career Recommendations

The system analyzes a user's current skills and recommends compatible career roles.

Example:

User Skills
────────────────────────
Python
SQL
Git
React

            ↓

Recommended Roles
────────────────────────
Python Developer       67%
Backend Developer      52%
Software Engineer      48%
Data Engineer          48%
Data Analyst            35%
...

Roles are presented with their matched and missing skills.

2. Skill Gap Analysis

For every recommended role, CareerGraph identifies the skills that the user currently has and the skills that are missing.

Example:

┌─────────────────────────────────────────┐
│ Python Developer                        │
│                                         │
│ Match: 67%                              │
│                                         │
│ Matched Skills                          │
│   ✓ Python                              │
│   ✓ SQL                                 │
│   ✓ Git                                 │
│                                         │
│ Missing Skills                          │
│   ✗ REST API                            │
└─────────────────────────────────────────┘

This gives the user an immediate understanding of what they need to improve.

3. Role-Specific Job Discovery

CareerGraph connects recommended career roles to job postings.

Recommended Role
       │
       ▼
Python Developer
       │
       ├── Job 1
       ├── Job 2
       ├── Job 3
       └── Job 4

Each job contains information such as:

Job Title
Company
Location
Experience Level
Employment Type
Required Skills
Skill Importance
Required Proficiency

This means users don't just receive a role recommendation — they can continue into the actual requirements associated with that role.

4. Job-Level Skill Matching

CareerGraph performs another matching step at the individual job level.

                  USER
                   │
                   ▼
             Current Skills
                   │
                   ▼
          ┌─────────────────┐
          │ Compare Skills  │
          └────────┬────────┘
                   │
                   ▼
          Job Requirements
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
    Matched Skills     Missing Skills
          │                 │
          ▼                 ▼
     Skill Weight       Skill Gap
          │
          ▼
   Proficiency Weight
          │
          ▼
     Match Percentage

Example:

Job: Python Developer
Company: TechNova
Location: Bangalore

Required Skills
────────────────────────────
Python       High     Intermediate
Django       High     Intermediate
SQL          Medium   Intermediate
Git          Medium   Beginner

User Matches
────────────────────────────
✓ Python
✓ SQL
✓ Git

Missing
────────────────────────────
✗ Django

The resulting job match provides a more specific assessment than the broader role recommendation.

5. Skill Importance and Proficiency

Job requirements contain two important properties:

Importance
    High
    Medium
    Low

Proficiency
    Beginner
    Intermediate
    Advanced

CareerGraph uses these attributes while calculating compatibility.

Proficiency Weights
Beginner       → 50%
Intermediate   → 75%
Advanced       → 100%

This allows the system to distinguish between simply having a skill and having it at the required proficiency.

🧠 Matching Pipeline

The complete recommendation process can be represented as:

┌──────────────────────┐
│   USER PROFILE       │
│                      │
│ Current Skills       │
│ Skill Proficiency    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   ROLE MATCHING      │
│                      │
│ Compare skills with  │
│ role requirements    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ RECOMMENDED ROLES    │
│                      │
│ Match %              │
│ Matched Skills       │
│ Missing Skills       │
└──────────┬───────────┘
           │
           ├───────────────────────┐
           │                       │
           ▼                       ▼
┌──────────────────────┐  ┌──────────────────────┐
│   SKILL GAP          │  │   ROLE JOBS          │
│                      │  │                      │
│ Missing technologies │  │ Available postings   │
└──────────────────────┘  └──────────┬───────────┘
                                     │
                                     ▼
                           ┌──────────────────────┐
                           │   JOB MATCHING       │
                           │                      │
                           │ User vs Job Skills   │
                           └──────────┬───────────┘
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │   CAREER FOCUS       │
                           │                      │
                           │ Skills to develop    │
                           └──────────────────────┘
🏗️ System Architecture

CareerGraph consists of three primary layers:

┌─────────────────────────────────────────────────────────┐
│                     CAREERGRAPH                         │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                       │
│                                                         │
│                  React + Vite                           │
│                                                         │
│  Overview | Recommended Roles | Jobs | Career Focus    │
│  Skills   | Profile                                     │
└───────────────────────────┬─────────────────────────────┘
                            │
                         REST API
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                        │
│                                                         │
│                    FastAPI                              │
│                                                         │
│  Routes                                                 │
│    ├── Role APIs                                        │
│    ├── Job APIs                                         │
│    └── Health API                                       │
│                                                         │
│  Services                                               │
│    ├── Role Matching                                    │
│    └── Job Matching                                     │
└───────────────────────────┬─────────────────────────────┘
                            │
                         Cypher
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  GRAPH DATABASE                         │
│                                                         │
│              CognoDB / Neo4j-Compatible                 │
│                                                         │
│  User ── Skill ── Role ── Job ── Company                │
└─────────────────────────────────────────────────────────┘
🗄️ Graph Data Model

The graph model is the core of CareerGraph.

┌──────────────┐
│     USER     │
└──────┬───────┘
       │
       │ HAS_SKILL
       ▼
┌──────────────┐
│    SKILL     │
└──────┬───────┘
       │
       │ supports / required by
       ▼
┌──────────────┐
│     ROLE     │
└──────┬───────┘
       │
       │ FOR_ROLE
       ▼
┌──────────────┐
│ JOB POSTING  │
└──────┬───────┘
       │
       ├──────────────────────┐
       │                      │
       │ REQUIRES             │ OFFERED_BY
       ▼                      ▼
┌──────────────┐       ┌──────────────┐
│    SKILL     │       │   COMPANY    │
└──────────────┘       └──────────────┘
Core relationships
(User)-[:HAS_SKILL]->(Skill)

(JobPosting)-[:FOR_ROLE]->(Role)

(JobPosting)-[:OFFERED_BY]->(Company)

(JobPosting)-[:REQUIRES]->(Skill)

The graph structure makes it possible to move from a user's skills to compatible roles and then from those roles to relevant job postings.

🔄 End-to-End User Flow
STEP 1
User opens CareerGraph
        │
        ▼
STEP 2
System loads user profile
        │
        ▼
STEP 3
Current skills are analyzed
        │
        ▼
STEP 4
Compatible career roles are identified
        │
        ▼
STEP 5
Roles are ranked by match
        │
        ▼
STEP 6
User views skill gaps
        │
        ▼
STEP 7
User selects a career role
        │
        ▼
STEP 8
System displays jobs for that role
        │
        ▼
STEP 9
User opens an individual job
        │
        ▼
STEP 10
System compares user skills with job requirements
        │
        ▼
STEP 11
User sees job match + missing skills
        │
        ▼
STEP 12
User decides what career path / skills to focus on
🖥️ Frontend

The frontend is built using React and Vite.

Main sections
CareerGraph
│
├── Overview
│   ├── Current Skills
│   ├── Best Match
│   ├── Roles Analyzed
│   └── Recommended Roles
│
├── Recommended Roles
│   ├── Role Match %
│   ├── Matched Skills
│   ├── Missing Skills
│   └── View Role
│
├── Job Postings
│   ├── Job Title
│   ├── Company
│   ├── Location
│   ├── Experience
│   └── Requirements
│
├── Career Focus
│   └── Skills to Develop
│
├── Your Skills
│   └── Current Skill Profile
│
└── Profile
    └── User Information
⚙️ Backend

The backend is implemented using:

Python
   │
   ▼
FastAPI
   │
   ├── Routes
   │
   ├── Services
   │
   └── Database Driver
           │
           ▼
     Graph Database

The backend exposes REST endpoints consumed by the React frontend.

🔌 API Endpoints
Health Check
GET /api/health

Used to verify that the API is running and that the graph database connection is available.

Example:

{
  "status": "ok",
  "service": "CareerGraph API",
  "database": "connected"
}
Recommended Roles
GET /api/users/{user_id}/recommended-roles

Returns career roles recommended for a user based on their current skills.

Example response structure:

{
  "user_id": "user-demo",
  "recommendations": [
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
  ]
}
💼 Jobs for a Role
GET /api/roles/{role_id}/jobs

Returns job postings associated with a particular career role.

Example:

{
  "role_id": "python-developer",
  "role": "Python Developer",
  "total_jobs": 1,
  "jobs": [
    {
      "job_id": "job-python-001",
      "job_title": "Python Developer",
      "company": "TechNova",
      "location": "Bangalore",
      "experience_level": "Entry Level",
      "employment_type": "Full Time"
    }
  ]
}
🎯 Job Match
GET /api/jobs/{job_id}/match?user_id={user_id}

Calculates the compatibility between a user and a specific job.

Example:

{
  "job_id": "job-python-001",
  "job_title": "Python Developer",
  "company": "TechNova",
  "location": "Bangalore",
  "total_required_skills": 4,
  "matched_skills": 3,
  "match_percentage": 60,
  "matched_skills_list": [
    "Python",
    "SQL",
    "Git"
  ],
  "missing_skills": [
    "Django"
  ]
}
📊 Job Requirements

A job requirement contains:

{
  "id": "python",
  "importance": "high",
  "name": "Python",
  "proficiency": "intermediate"
}

This allows the matching system to consider not only whether a skill exists but also how important that skill is and what proficiency level is expected.

🧰 Technology Stack
Frontend
React
Vite
JavaScript
React Router
CSS
Backend
Python
FastAPI
Uvicorn
Neo4j Python Driver
Cypher
Database
CognoDB
Neo4j-Compatible Graph Database
Development Tools
Git
GitHub
VS Code
npm
Python Virtual Environment
Postman / Browser API Testing
📁 Project Structure
CareerGraph/
│
├── backend/
│   │
│   ├── app/
│   │   ├── database/
│   │   │   └── driver.py
│   │   │
│   │   ├── routes/
│   │   │   ├── roles.py
│   │   │   └── jobs.py
│   │   │
│   │   ├── services/
│   │   │   ├── role matching
│   │   │   └── job matching
│   │   │
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── seed/
│   │   └── data/
│   │
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── ...
│
├── docs/
│
├── README.md
├── .gitignore
└── ...
🔗 Frontend ↔ Backend Communication

The frontend centralizes API communication through a service layer.

React Component
       │
       ▼
frontend/src/services/api.js
       │
       ▼
VITE_API_URL
       │
       ▼
FastAPI Backend
       │
       ▼
/api/...

The frontend uses API functions such as:

getRecommendedRoles(userId)

getJobsForRole(roleId)

getJobMatch(userId, jobId)

getSkillDemand(roleId)

This keeps API communication separate from UI components.

🧪 Validation & Testing

CareerGraph was tested across the major application flows.

Backend
✓ FastAPI server startup
✓ Graph database connectivity
✓ Health endpoint
✓ Recommended role endpoint
✓ Role → Job endpoint
✓ Job matching endpoint
✓ Invalid user handling
✓ Invalid job handling
✓ Invalid role handling
Frontend
✓ Production build
✓ API integration
✓ Recommended roles loading
✓ Job posting loading
✓ Job matching
✓ Navigation between application sections
✓ Production deployment
✓ Frontend → Render backend communication
✓ CORS configuration
🛡️ Error Handling

The API handles invalid resources with appropriate errors.

Examples:

Unknown Role
    ↓
404 Not Found

Unknown Job
    ↓
404 Not Found

Unknown User
    ↓
404 Not Found

Example:

{
  "detail": "Job or user not found"
}
🌱 Seed Data

CareerGraph uses deterministic seed data so that the application can be evaluated consistently.

The dataset contains career roles, skills, companies, users, and job postings connected through graph relationships.

The current application supports 13 career roles in the seeded recommendation dataset.

Example career roles include:

Python Developer
Backend Developer
Software Engineer
Data Engineer
Data Analyst
Database Developer
Full Stack Developer
AI Engineer
Frontend Developer
Machine Learning Engineer
Data Scientist
Cloud Engineer
DevOps Engineer
📈 Example Recommendation

For a sample user with:

Python
SQL
Git
React

CareerGraph can produce recommendations such as:

┌────────────────────────────────────────┐
│         RECOMMENDED CAREER ROLES       │
├────────────────────────────────────────┤
│                                        │
│ Python Developer             67%       │
│ Backend Developer            52%       │
│ Software Engineer            48%       │
│ Data Engineer                48%       │
│ Data Analyst                 35%       │
│ Database Developer           34%       │
│ Full Stack Developer         33%       │
│ AI Engineer                  30%       │
│ Frontend Developer           23%       │
│ Machine Learning Engineer    18%       │
│ Data Scientist               17%       │
│ Cloud Engineer               11%       │
│ DevOps Engineer               9%       │
│                                        │
└────────────────────────────────────────┘

The user can then select a role and continue to its associated job postings.

🔎 Example: Role → Job → Match
USER
 │
 │ Skills:
 │ Python, SQL, Git
 │
 ▼
PYTHON DEVELOPER
 │
 │ Role Match: 67%
 │
 ├── Matched
 │     ├── Python
 │     ├── SQL
 │     └── Git
 │
 └── Missing
       └── REST API
 │
 ▼
TECHNOVA
 │
 └── Python Developer
       │
       ├── Python       ✓
       ├── Django       ✗
       ├── SQL          ✓
       └── Git          ✓
       │
       ▼
     JOB MATCH
       │
       ▼
   Missing Skill:
      Django

This two-level matching process is one of the core ideas of CareerGraph:

LEVEL 1
User → Career Role

LEVEL 2
User → Specific Job
☁️ Deployment Architecture

CareerGraph is deployed as separate frontend and backend services.

                         GITHUB
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
          VERCEL                      RENDER
              │                         │
              ▼                         ▼
      React Frontend             FastAPI Backend
              │                         │
              │       HTTPS             │
              └────────────────────────►│
                                        │
                                        ▼
                                CognoDB / Neo4j
                                Graph Database
Production flow
User Browser
     │
     ▼
Vercel
     │
     │ REST API Request
     ▼
Render
     │
     ▼
FastAPICOGNODB_URI
     │
     ▼
CognoDB
     │
     ▼
Graph Query Result
     │
     ▼
FastAPI
     │
     ▼
React Frontend
     │
     ▼
User
🔐 Environment Variables

Environment variables are used to keep database configuration outside the source code.

Backend configuration:

COGNODB_URI
COGNODB_USERNAME
COGNODB_PASSWORD

Frontend configuration:

VITE_API_URL

Example frontend configuration:

VITE_API_URL=https://careergraph-backend-jf5d.onrender.com

Secrets should never be committed to GitHub.

🖥️ Run Locally
Prerequisites

Install:

Python 3.x
Node.js
npm
Git

You also need access to the configured CognoDB / Neo4j-compatible graph database.

1. Clone the Repository
git clone <https://github.com/chaitanyaReddy4/CareerGraph.git>
cd CareerGraph
2. Backend Setup

Move into the backend:

cd backend

Create a virtual environment:

python -m venv .venv

Activate it on Windows:

.\.venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Configure the environment variables:

COGNODB_URI=your_database_uri
COGNODB_USERNAME=your_username
COGNODB_PASSWORD=your_password

Start FastAPI:

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Backend:

http://127.0.0.1:8000

Health check:

http://127.0.0.1:8000/api/health
3. Frontend Setup

Open another terminal.

cd frontend

Install dependencies:

npm install

Create the frontend environment configuration:

VITE_API_URL=http://127.0.0.1:8000

Start the development server:

npm run dev

The frontend will run using Vite's development server.

🔧 Production Build

Build the frontend:

npm run build

The production files are generated inside:

frontend/dist/

Preview the production build locally if required:

npm run preview
🩺 Backend Health Check

The backend exposes:

GET /api/health

Example successful response:

{
  "status": "ok",
  "service": "CareerGraph API",
  "database": "connected"
}

This endpoint is useful for deployment verification because it checks both:

FastAPI
   +
Graph Database
🧩 Why Graph Database?

The main reason for using a graph database is the relationship-heavy nature of the application.

CareerGraph needs to answer questions such as:

Which roles require the skills I have?

Which skills are missing for a particular role?

Which jobs belong to this role?

Which skills does this job require?

Which companies offer these jobs?

Which skills repeatedly appear across potential career paths?

These are naturally represented as connected entities:

User
 │
 └── HAS_SKILL ──► Skill
                       │
                       ▼
                     Role
                       │
                       ▼
                  Job Posting
                   │         │
                   ▼         ▼
                 Skill     Company

The graph model provides a natural foundation for traversing these relationships.

🧮 Matching Philosophy

CareerGraph separates role suitability from job suitability.

                 USER
                  │
                  ▼
          ┌───────────────┐
          │ Role Matching │
          └───────┬───────┘
                  │
                  ▼
          Recommended Roles
                  │
                  ▼
           Selected Role
                  │
                  ▼
           Role's Jobs
                  │
                  ▼
          ┌───────────────┐
          │ Job Matching  │
          └───────┬───────┘
                  │
                  ▼
          Specific Job Match

This is important because a candidate can be a strong fit for a career role while still missing one or more requirements of a particular job.

🔮 Future Enhancements

The current graph architecture provides a foundation for additional career intelligence features.

1. Career Path Recommendations
Current Role
     │
     ▼
Required Skills
     │
     ▼
Intermediate Role
     │
     ▼
Target Role

CareerGraph could recommend paths based on skill similarity and prerequisite relationships.

2. Skill Demand Analysis

The system can analyze job requirements to identify frequently requested skills.

Jobs
 │
 ▼
Required Skills
 │
 ▼
Skill Frequency
 │
 ▼
High-Demand Skills

This can help users prioritize their learning.

3. Personalized Learning Paths

Skill gaps can be converted into a learning roadmap.

Target Role
     │
     ▼
Required Skills
     │
     ▼
User Skills Comparison
     │
     ▼
Missing Skills
     │
     ▼
Learning Priority
     │
     ▼
Personalized Roadmap
4. Job Description Intelligence

A future version could accept a job description and automatically extract:

Technologies
Frameworks
Tools
Experience
Required Skills
Preferred Skills

These extracted skills could then be compared directly against the user's graph profile.

5. Dynamic Job Data

The current implementation uses deterministic job data for consistent development and evaluation.

A future production version could integrate live job sources while preserving the same graph model.

External Job Sources
        │
        ▼
Job Data Processing
        │
        ▼
Skill Extraction
        │
        ▼
Graph Database
        │
        ▼
CareerGraph Recommendations
📊 Application Architecture Summary
┌────────────────────────────────────────────────────┐
│                    CAREERGRAPH                     │
├────────────────────────────────────────────────────┤
│                                                    │
│  USER PROFILE                                      │
│       │                                            │
│       ▼                                            │
│  CURRENT SKILLS                                    │
│       │                                            │
│       ▼                                            │
│  ROLE MATCHING                                     │
│       │                                            │
│       ├──────────────► MATCHED SKILLS              │
│       │                                            │
│       ├──────────────► MISSING SKILLS              │
│       │                                            │
│       ▼                                            │
│  RECOMMENDED ROLES                                 │
│       │                                            │
│       ▼                                            │
│  ROLE-SPECIFIC JOBS                                │
│       │                                            │
│       ▼                                            │
│  JOB MATCHING                                      │
│       │                                            │
│       ├──────────────► JOB MATCH %                 │
│       │                                            │
│       └──────────────► JOB SKILL GAPS              │
│                                                    │
│                       ▼                            │
│                  CAREER FOCUS                     │
│                                                    │
└────────────────────────────────────────────────────┘
📌 Project Status

CareerGraph currently provides an end-to-end implementation of:

✓ User skill representation
✓ Graph-based career role matching
✓ Ranked role recommendations
✓ Role-level skill gap analysis
✓ Role-specific job discovery
✓ Individual job matching
✓ Job-level skill gap analysis
✓ Skill importance handling
✓ Proficiency-based matching
✓ FastAPI REST APIs
✓ React/Vite frontend
✓ Graph database integration
✓ Deterministic seed data
✓ Frontend/backend production deployment
✓ CORS configuration
✓ Health monitoring
🏆 What Makes CareerGraph Different?

CareerGraph is not simply:

Job Search
+
Filters

Instead, it provides a connected career intelligence workflow:

                ┌─────────────────┐
                │   YOUR SKILLS   │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  CAREER ROLES   │
                └────────┬────────┘
                         │
                 ┌───────┴───────┐
                 │               │
                 ▼               ▼
          ┌────────────┐   ┌─────────────┐
          │ SKILL GAPS │   │    JOBS     │
          └────────────┘   └──────┬──────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │ JOB MATCH   │
                           └──────┬──────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │ CAREER      │
                           │ FOCUS       │
                           └─────────────┘

The goal is to move from:

"What jobs exist?"

to:

"What career path makes sense for me,
what jobs fit that path,
and what should I learn next?"
👨‍💻 Author
Chaitanya Reddy

CareerGraph was developed as a graph-powered career intelligence platform combining:

React
+
FastAPI
+
Python
+
Graph Database
+
Cypher
+
REST APIs

The project demonstrates the integration of frontend development, backend API engineering, graph data modeling, recommendation logic, job matching, and production deployment.
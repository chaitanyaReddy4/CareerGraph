from fastapi import APIRouter, HTTPException

from app.services.job_matching import (
    get_jobs_for_role,
    get_job_match,
)


router = APIRouter(
    prefix="/api",
    tags=["Jobs"],
)


@router.get("/roles/{role_id}/jobs")
def get_role_jobs(role_id: str):
    try:
        jobs = get_jobs_for_role(role_id)

        if not jobs:
            raise HTTPException(
                status_code=404,
                detail="No job postings found for this role",
            )

        return {
            "role_id": role_id,
            "role": jobs[0]["role"],
            "total_jobs": len(jobs),
            "jobs": jobs,
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve job postings: {str(exc)}",
        )


@router.get("/jobs/{job_id}/match")
def job_match(
    job_id: str,
    user_id: str,
):
    try:
        result = get_job_match(
            user_id=user_id,
            job_id=job_id,
        )

        if not result:
            raise HTTPException(
                status_code=404,
                detail="Job or user not found",
            )

        return result

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate job match: {str(exc)}",
        )
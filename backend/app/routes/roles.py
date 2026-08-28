from fastapi import APIRouter, HTTPException
from app.services.skill_demand import get_skill_demand
from app.services.role_matching import get_role_recommendations


router = APIRouter(
    prefix="/api",
    tags=["Roles"],
)

@router.get("/roles/{role_id}/skill-demand")
def role_skill_demand(role_id: str):
    try:
        demand = get_skill_demand(role_id)

        if not demand:
            raise HTTPException(
                status_code=404,
                detail="No skill demand data found for this role",
            )

        return {
            "role_id": role_id,
            "role": demand[0]["role"],
            "total_jobs": demand[0]["total_jobs"],
            "skills": demand,
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate skill demand: {str(exc)}",
        )
@router.get("/users/{user_id}/recommended-roles")
def recommended_roles(user_id: str):
    try:
        recommendations = get_role_recommendations(user_id)

        if not recommendations:
            raise HTTPException(
                status_code=404,
                detail="User not found or no role recommendations available",
            )

        return {
            "user_id": user_id,
            "recommendations": recommendations,
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate role recommendations: {str(exc)}",
        )
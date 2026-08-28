import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import RoleCard from "../components/RoleCard";
import StatusCard from "../components/StatusCard";
import { getRecommendedRoles } from "../services/api";
import { DEMO_USER_ID, normalizeRole } from "../utils/careerData";

function Roles() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoles() {
      try {
        setLoading(true);
        setError("");
        const data = await getRecommendedRoles(DEMO_USER_ID);
        const recommendations = (data?.recommendations || [])
          .map(normalizeRole)
          .sort((left, right) => right.matchPercentage - left.matchPercentage);

        setRoles(recommendations);
      } catch (err) {
        console.error(err);
        setError("Unable to load career recommendations.");
      } finally {
        setLoading(false);
      }
    }

    loadRoles();
  }, []);

  if (loading) {
    return (
      <StatusCard
        type="loading"
        title="Finding your recommended roles..."
        description="We are ranking roles based on the skills already in your profile."
      />
    );
  }

  if (error) {
    return (
      <StatusCard
        type="error"
        title="Unable to load this information."
        description={error}
      />
    );
  }

  return (
    <div className="content-page">
      <PageHeader
        eyebrow="Career Intelligence"
        title="Recommended Roles"
        description="Career roles ranked by how closely they match your current skills."
        meta={<div className="header-chip">{roles.length} roles analyzed</div>}
      />

      {roles.length === 0 ? (
        <StatusCard
          type="empty"
          title="No career recommendations available yet."
          description="Try expanding the skills associated with your profile."
        />
      ) : (
        <div className="stack">
          {roles.map((role) => (
            <RoleCard
              key={role.roleId}
              role={role}
              onView={() => navigate(`/roles/${role.roleId}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Roles;

import { Navigate } from "react-router-dom";

const ProtectedSuperAdmin = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("adminRole");

  if (!token || role !== "super-admin") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedSuperAdmin;

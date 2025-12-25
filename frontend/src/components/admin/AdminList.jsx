import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAdminRole, setCurrentAdminRole] = useState(null);
  const [currentAdminId, setCurrentAdminId] = useState(null);

  const getAdminInfo = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return { role: null, id: null };

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { role: payload.role, id: payload.id };
    } catch {
      return { role: null, id: null };
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get("/api/admin/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const adminsData = res.data.admins || [];

      // 🔥 SORTING LOGIC
      const superAdmins = adminsData.filter(
        (a) => a.role === "super-admin"
      );

      const normalAdmins = adminsData
        .filter((a) => a.role !== "super-admin")
        .sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ); // newest first

      setAdmins([...superAdmins, ...normalAdmins]);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (id) => {
    // Additional check to prevent self-deletion
    if (id === currentAdminId) {
      alert("You cannot delete your own account!");
      return;
    }

    const yes = window.confirm("Are you sure you want to delete this admin?");
    if (!yes) return;

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(`/api/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmins((prev) => prev.filter((a) => a._id !== id));
      alert("Admin deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete admin");
    }
  };

  useEffect(() => {
    // Get current admin info first
    const { role, id } = getAdminInfo();
    setCurrentAdminRole(role);
    setCurrentAdminId(id);
    
    // Then fetch all admins
    fetchAdmins();
  }, []);

  // Function to check if delete button should be shown
  const shouldShowDeleteButton = (admin) => {
    // Only super-admin can delete
    if (currentAdminRole !== "super-admin") return false;
    
    // Cannot delete other super-admins
    if (admin.role === "super-admin") return false;
    
    // Cannot delete yourself
    if (admin._id === currentAdminId) return false;
    
    return true;
  };

  return (
  
    <div className="p-4 sm:p-6 lg:p-8 text-[#6a4a2b] lg:ml-64">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#8B5E3C]">
          Admin Accounts
        </h2>
        <div className="text-sm px-3 py-1 bg-[#8B5E3C] text-white rounded-lg">
          Your Role: <span className="font-bold">{currentAdminRole || "Unknown"}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5E3C]"></div>
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-[#e6e0db]">
          <i className="bx bx-user-x text-4xl text-gray-400 mb-3"></i>
          <p className="text-[#6a4a2b] text-lg">No admins found.</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className={`w-full bg-white border border-[#e6e0db] rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-[#fff9f4] transition ${
                admin._id === currentAdminId ? "ring-2 ring-[#d69e64]" : ""
              }`}
            >
              {/* LEFT SIDE - Admin Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-[#8B5E3C] truncate">
                    {admin.name}
                    {admin._id === currentAdminId && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-[#d69e64] text-white rounded-full">
                        You
                      </span>
                    )}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-sm text-[#6a4a2b] truncate flex items-center">
                    <i className="bx bx-envelope mr-1 text-gray-500"></i>
                    {admin.email}
                  </p>

                  <p className="text-xs text-[#6a4a2b]/70 flex items-center">
                    <i className="bx bx-calendar mr-1 text-gray-500"></i>
                    Created: {new Date(admin.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* ROLE BADGE */}
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    admin.role === "super-admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-orange-100 text-[#d69e64]"
                  }`}>
                    <i className={`bx mr-1 ${
                      admin.role === "super-admin" ? "bx-crown" : "bx-user"
                    }`}></i>
                    {admin.role}
                  </span>
                </div>
              </div>

              {/* RIGHT SIDE - Delete Button (Only for super-admin on non-super-admin accounts) */}
              <div>
                {shouldShowDeleteButton(admin) ? (
                  <button
                    onClick={() => deleteAdmin(admin._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm sm:text-base font-medium shadow flex items-center"
                  >
                    <i className="bx bx-trash mr-2"></i>
                    Delete
                  </button>
                ) : (
                  // Show info message for why delete is disabled
                  <div className="text-xs text-gray-500 italic px-2">
                    {admin.role === "super-admin" ? "Super Admin" : 
                     admin._id === currentAdminId ? "Your account" : 
                     "Cannot delete"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
  );
};

export default AdminList;
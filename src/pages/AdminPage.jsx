// src/pages/AdminPage.jsx
import React, { useState } from "react";
import UploadDocs from "../components/Admin/UploadDocs";
import BranchForm from "../components/Admin/BranchForm";
import "./AdminPage.css";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("docs");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="tab-buttons">
        <button
          className={activeTab === "docs" ? "active" : ""}
          onClick={() => setActiveTab("docs")}
        >
          Upload Docs
        </button>
        <button
          className={activeTab === "branch" ? "active" : ""}
          onClick={() => setActiveTab("branch")}
        >
          Branch Info
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "docs" ? <UploadDocs /> : <BranchForm />}
      </div>
    </div>
  );
};

export default AdminPage;

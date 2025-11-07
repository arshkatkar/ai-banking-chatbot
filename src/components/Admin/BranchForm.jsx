// src/components/Admin/BranchForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminTable.css";

const BranchForm = () => {
  const [branch, setBranch] = useState({ name: "", ifsc: "", address: "" });
  const [branches, setBranches] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/branches");
      setBranches(res.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const handleChange = (e) => {
    setBranch({ ...branch, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branch.name || !branch.ifsc || !branch.address)
      return setMessage("⚠️ All fields are required.");

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/branches/${editId}`, branch);
        setMessage("✅ Branch updated successfully!");
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/branches", branch);
        setMessage("✅ Branch added successfully!");
      }
      setBranch({ name: "", ifsc: "", address: "" });
      fetchBranches();
    } catch (error) {
      setMessage("❌ Failed to save branch info.");
    }
  };

  const handleEdit = (b) => {
    setBranch({ name: b.name, ifsc: b.ifsc, address: b.address });
    setEditId(b.id);
  };

  const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this branch?")) {
    try {
      await axios.delete(`http://localhost:5000/branches/${id}`);
      fetchBranches();
      setMessage("🗑️ Branch deleted successfully!");

      // Automatically clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Failed to delete branch.");
      setTimeout(() => setMessage(""), 3000);
    }
  }
};


  return (
    <div className="branch-container">
      <h3>Add Branch Information</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Branch Name"
          value={branch.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ifsc"
          placeholder="IFSC Code"
          value={branch.ifsc}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Branch Address"
          value={branch.address}
          onChange={handleChange}
        />
        <button type="submit">{editId ? "Update" : "Save"}</button>
      </form>
      {message && <p className="msg">{message}</p>}

      <div className="data-table">
        <h4>Branch List</h4>
        {branches.length === 0 ? (
          <p>No branch records available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Branch Name</th>
                <th>IFSC</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name}</td>
                  <td>{b.ifsc}</td>
                  <td>{b.address}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(b)}>
                      ✏️ Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(b.id)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BranchForm;

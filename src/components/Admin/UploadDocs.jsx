// src/components/Admin/UploadDocs.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminTable.css";

const UploadDocs = () => {
  const [docLink, setDocLink] = useState("");
  const [message, setMessage] = useState("");
  const [docs, setDocs] = useState([]);
  const [editId, setEditId] = useState(null); // Track which doc is being edited

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/docs");
      setDocs(res.data);
    } catch (error) {
      console.error("Error fetching docs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docLink) return setMessage("⚠️ Please enter a valid Google Doc URL");

    try {
      if (editId) {
        // Update existing doc
        await axios.put(`http://localhost:5000/docs/${editId}`, { link: docLink });
        setMessage("✅ Google Doc updated successfully!");
        setEditId(null);
      } else {
        // Add new doc
        await axios.post("http://localhost:5000/docs", { link: docLink });
        setMessage("✅ Google Doc added successfully!");
      }
      setDocLink("");
      fetchDocs();
    } catch (error) {
      setMessage("❌ Failed to save. Try again.");
    }
  };

  const handleEdit = (doc) => {
    setDocLink(doc.link);
    setEditId(doc.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await axios.delete(`http://localhost:5000/docs/${id}`);
      fetchDocs();
    }
  };

  return (
    <div className="upload-container">
      <h3>Upload Google Doc Link</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter Google Doc URL"
          value={docLink}
          onChange={(e) => setDocLink(e.target.value)}
        />
        <button type="submit">{editId ? "Update" : "Upload"}</button>
      </form>
      {message && <p className="msg">{message}</p>}

      <div className="data-table">
        <h4>Uploaded Docs</h4>
        {docs.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Document Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.id}</td>
                  <td>
                    <a href={doc.link} target="_blank" rel="noreferrer">
                      {doc.link}
                    </a>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(doc)}>
                      ✏️ Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(doc.id)}>
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

export default UploadDocs;

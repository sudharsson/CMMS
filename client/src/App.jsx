import { useState, useEffect } from "react";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/assets`;

function App() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    asset_tag: "", name: "", location: "", category: "",
  });

  // Tracks which row is being edited (its id), and the edited values
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  async function loadAssets() {
    const res = await fetch(API);
    const data = await res.json();
    setAssets(data);
  }

  useEffect(() => { loadAssets(); }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.asset_tag || !form.name) {
      alert("Asset tag and name are required");
      return;
    }
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ asset_tag: "", name: "", location: "", category: "" });
    loadAssets();
  }

  async function handleDelete(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadAssets();
  }

  // --- EDIT LOGIC ---
  function startEdit(asset) {
    setEditingId(asset.id);
    setEditForm({ ...asset }); // copy the row's current values into the edit form
  }

  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function saveEdit(id) {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    setEditForm({});
    loadAssets();
  }

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>CMMS — Asset Register</h1>

      <h2>Add Asset</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <input name="asset_tag" placeholder="Asset Tag" value={form.asset_tag} onChange={handleChange} />
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <button onClick={handleSubmit}>Add</button>
      </div>

      <h2>Assets ({assets.length})</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th><th>Tag</th><th>Name</th><th>Location</th>
            <th>Category</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              {editingId === a.id ? (
                // EDIT MODE — this row shows inputs
                <>
                  <td><input name="asset_tag" value={editForm.asset_tag || ""} onChange={handleEditChange} /></td>
                  <td><input name="name" value={editForm.name || ""} onChange={handleEditChange} /></td>
                  <td><input name="location" value={editForm.location || ""} onChange={handleEditChange} /></td>
                  <td><input name="category" value={editForm.category || ""} onChange={handleEditChange} /></td>
                  <td>
                    <select name="status" value={editForm.status || "operational"} onChange={handleEditChange}>
                      <option value="operational">operational</option>
                      <option value="maintenance">maintenance</option>
                      <option value="down">down</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => saveEdit(a.id)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                // VIEW MODE — this row shows plain text
                <>
                  <td>{a.asset_tag}</td>
                  <td>{a.name}</td>
                  <td>{a.location}</td>
                  <td>{a.category}</td>
                  <td>{a.status}</td>
                  <td>
                  
  <button
    onClick={() => startEdit(a)}
    style={{ background: "#2563eb", color: "white", border: "none", padding: "6px 12px", borderRadius: 4, marginRight: 8, cursor: "pointer" }}
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(a.id)}
    style={{ background: "#dc2626", color: "white", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer" }}
  >
    Delete
  </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

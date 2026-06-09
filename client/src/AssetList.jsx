import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/assets`;
const SITE = window.location.origin; // the base URL of your site

function AssetList() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({ asset_tag: "", name: "", location: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  async function loadAssets() {
    const res = await fetch(API);
    setAssets(await res.json());
  }
  useEffect(() => { loadAssets(); }, []);

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit() {
    if (!form.asset_tag || !form.name) { alert("Asset tag and name are required"); return; }
    await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ asset_tag: "", name: "", location: "", category: "" });
    loadAssets();
  }

  async function handleDelete(id) { await fetch(`${API}/${id}`, { method: "DELETE" }); loadAssets(); }

  function startEdit(asset) { setEditingId(asset.id); setEditForm({ ...asset }); }
  function handleEditChange(e) { setEditForm({ ...editForm, [e.target.name]: e.target.value }); }
  function cancelEdit() { setEditingId(null); setEditForm({}); }
  async function saveEdit(id) {
    await fetch(`${API}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editForm) });
    setEditingId(null); setEditForm({}); loadAssets();
  }

  const btn = (bg) => ({ background: bg, color: "white", border: "none", padding: "6px 12px", borderRadius: 4, marginRight: 8, cursor: "pointer" });

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>CMMS — Asset Register</h1>

      <h2>Add Asset</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <input name="asset_tag" placeholder="Asset Tag" value={form.asset_tag} onChange={handleChange} />
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <button onClick={handleSubmit} style={btn("#2563eb")}>Add</button>
      </div>

      <h2>Assets ({assets.length})</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr><th>ID</th><th>Tag</th><th>Name</th><th>Location</th><th>Category</th><th>Status</th><th>QR</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              {editingId === a.id ? (
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
                  <td>—</td>
                  <td>
                    <button onClick={() => saveEdit(a.id)} style={btn("#16a34a")}>Save</button>
                    <button onClick={cancelEdit} style={btn("#6b7280")}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td><Link to={`/asset/${a.asset_tag}`}>{a.asset_tag}</Link></td>
                  <td>{a.name}</td>
                  <td>{a.location}</td>
                  <td>{a.category}</td>
                  <td>{a.status}</td>
                  <td><QRCodeSVG value={`${SITE}/asset/${a.asset_tag}`} size={64} /></td>
                  <td>
                    <button onClick={() => startEdit(a)} style={btn("#2563eb")}>Edit</button>
                    <button onClick={() => handleDelete(a.id)} style={btn("#dc2626")}>Delete</button>
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

export default AssetList;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function WorkOrders() {
  const [orders, setOrders] = useState([]);
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    asset_id: "", title: "", description: "", priority: "medium", assigned_to: "", due_date: "",
  });

  async function loadOrders() {
    const res = await fetch(`${BASE}/api/work-orders`);
    setOrders(await res.json());
  }
  async function loadAssets() {
    const res = await fetch(`${BASE}/api/assets`);
    setAssets(await res.json());
  }
  useEffect(() => { loadOrders(); loadAssets(); }, []);

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit() {
    if (!form.title) { alert("Title is required"); return; }
    await fetch(`${BASE}/api/work-orders`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    setForm({ asset_id: "", title: "", description: "", priority: "medium", assigned_to: "", due_date: "" });
    loadOrders();
  }

  async function updateStatus(order, newStatus) {
    await fetch(`${BASE}/api/work-orders/${order.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...order, status: newStatus }),
    });
    loadOrders();
  }

  async function handleDelete(id) {
    await fetch(`${BASE}/api/work-orders/${id}`, { method: "DELETE" });
    loadOrders();
  }

  const btn = (bg) => ({ background: bg, color: "white", border: "none", padding: "6px 12px", borderRadius: 4, marginRight: 8, cursor: "pointer" });

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", fontFamily: "sans-serif" }}>
      <Link to="/">← Assets</Link>
      <h1>Work Orders</h1>

      <h2>New Work Order</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <select name="asset_id" value={form.asset_id} onChange={handleChange}>
          <option value="">— Select asset —</option>
          {assets.map((a) => <option key={a.id} value={a.id}>{a.asset_tag} — {a.name}</option>)}
        </select>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <input name="assigned_to" placeholder="Assigned to" value={form.assigned_to} onChange={handleChange} />
        <input name="due_date" type="date" value={form.due_date} onChange={handleChange} />
        <button onClick={handleSubmit} style={btn("#2563eb")}>Create</button>
      </div>

      <h2>All Work Orders ({orders.length})</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr><th>ID</th><th>Asset</th><th>Title</th><th>Priority</th><th>Status</th><th>Assigned</th><th>Due</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.asset_tag ? `${o.asset_tag} — ${o.asset_name}` : "—"}</td>
              <td>{o.title}</td>
              <td>{o.priority}</td>
              <td>{o.status}</td>
              <td>{o.assigned_to}</td>
              <td>{o.due_date ? o.due_date.slice(0, 10) : ""}</td>
              <td>
                {o.status !== "done" && (
                  <button onClick={() => updateStatus(o, "done")} style={btn("#16a34a")}>Mark Done</button>
                )}
                <button onClick={() => handleDelete(o.id)} style={btn("#dc2626")}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WorkOrders;
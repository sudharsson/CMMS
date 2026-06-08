const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("CMMS server is alive"));

app.post("/api/assets", async (req, res) => {
  try {
    const { asset_tag, name, location, category, status = "operational", parent_id = null } = req.body;
    const result = await pool.query(
      `INSERT INTO assets (asset_tag, name, location, category, status, parent_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [asset_tag, name, location, category, status, parent_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/assets", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM assets ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/assets/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM assets WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/assets/:id", async (req, res) => {
  try {
    const { asset_tag, name, location, category, status, parent_id } = req.body;
    const result = await pool.query(
      `UPDATE assets SET asset_tag=$1, name=$2, location=$3, category=$4, status=$5, parent_id=$6
       WHERE id=$7 RETURNING *`,
      [asset_tag, name, location, category, status, parent_id || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/assets/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM assets WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT =  process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
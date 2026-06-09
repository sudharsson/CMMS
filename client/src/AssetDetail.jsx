import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const SITE = window.location.origin;

function AssetDetail() {
  const { assetTag } = useParams(); // grabs the tag from the URL
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/api/assets/tag/${assetTag}`)
      .then((res) => {
        if (!res.ok) throw new Error("Asset not found");
        return res.json();
      })
      .then(setAsset)
      .catch((e) => setError(e.message));
  }, [assetTag]);

  if (error) return <div style={{ padding: 40 }}><p>{error}</p><Link to="/">← Back</Link></div>;
  if (!asset) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <Link to="/">← Back to all assets</Link>
      <h1>{asset.name}</h1>
      <p><strong>Tag:</strong> {asset.asset_tag}</p>
      <p><strong>Location:</strong> {asset.location}</p>
      <p><strong>Category:</strong> {asset.category}</p>
      <p><strong>Status:</strong> {asset.status}</p>
      <div style={{ marginTop: 20 }}>
        <QRCodeSVG value={`${SITE}/asset/${asset.asset_tag}`} size={160} />
        <p style={{ color: "#666", fontSize: 14 }}>Scan to open this asset</p>
      </div>
    </div>
  );
}

export default AssetDetail;

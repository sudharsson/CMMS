import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssetList from "./AssetList";
import AssetDetail from "./AssetDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AssetList />} />
        <Route path="/asset/:assetTag" element={<AssetDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
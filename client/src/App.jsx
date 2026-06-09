import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssetList from "./AssetList";
import AssetDetail from "./AssetDetail";
import WorkOrders from "./WorkOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AssetList />} />
        <Route path="/asset/:assetTag" element={<AssetDetail />} />
        <Route path="/work-orders" element={<WorkOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
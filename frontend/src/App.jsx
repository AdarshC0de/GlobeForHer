import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobePage from "./pages/GlobePage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GlobePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
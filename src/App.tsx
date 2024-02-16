import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import UploadFiles from "./Pages/UploadFiles";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadFiles />} />
    </Routes>
  );
}

export default App;

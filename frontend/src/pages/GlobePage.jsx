import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Globe from "../components/Globe";

export default function GlobePage() {
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/photos`)
      .then(res => setPhotos(res.data));
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      
      {/* BUTTON */}
      <button
        onClick={() => navigate("/admin")}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
          padding: "10px 15px",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Add Photos
      </button>

      <Globe photos={photos} />
    </div>
  );
}
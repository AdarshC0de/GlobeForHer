import { useEffect, useState } from "react";
import axios from "axios";
import Globe from "../components/Globe";

export default function GlobePage() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/photos")
      .then(res => setPhotos(res.data));
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Globe photos={photos} />;
    </div>
  )
}
import { useEffect, useState } from "react";
import axios from "axios";

function AdminPage() {
  const [photos, setPhotos] = useState([]);

  const fetchPhotos = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/photos`
    );
    setPhotos(res.data);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const deletePhoto = async (id) => {
    const confirmDelete = window.confirm("Delete this photo?");
    if (!confirmDelete) return;

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/photos/${id}`
    );

    fetchPhotos(); // refresh list
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      {/* PHOTO LIST */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {photos.map((photo) => (
          <div key={photo._id} style={{ position: "relative" }}>
            
            <img
              src={photo.url}
              alt=""
              width="200"
              style={{ borderRadius: "8px" }}
            />

            {/* ✅ DELETE BUTTON GOES HERE */}
            <button
              onClick={() => deletePhoto(photo._id)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 8px",
                cursor: "pointer"
              }}
            >
              X
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
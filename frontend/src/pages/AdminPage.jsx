import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all photos
  const fetchPhotos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/photos`);
      setPhotos(res.data);
    } catch (err) {
      console.error("Error fetching photos:", err);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Upload photo
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post(`${API_URL}/api/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFile(null);
      fetchPhotos(); // refresh list
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // Delete photo
  const deletePhoto = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/photos/${id}`);
      fetchPhotos();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Panel</h1>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: "20px",
          padding: "8px 15px",
          cursor: "pointer",
        }}
      >
        Back to Globe
      </button>

      {/* Upload Form */}
      <form onSubmit={handleUpload} style={{ marginBottom: "30px" }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Upload
        </button>
      </form>

      {/* Photos Grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {photos.length === 0 && <p>No photos uploaded yet.</p>}

        {photos.map((photo) => (
          <div
            key={photo._id}
            style={{
              position: "relative",
              width: "200px",
            }}
          >
            <img
              src={photo.url}
              alt=""
              width="200"
              style={{ borderRadius: "10px" }}
            />

            {/* Delete Button */}
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
                cursor: "pointer",
                borderRadius: "5px",
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